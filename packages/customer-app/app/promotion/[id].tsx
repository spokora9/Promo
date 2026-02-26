import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLocationStore } from '../../src/stores/locationStore';
import apiClient from '../../src/lib/api';

interface Promotion {
  id: string;
  title: string;
  description: string;
  terms?: string;
  discountType?: string;
  discountValue?: number;
  radiusMeters: number;
  startDate: string;
  endDate: string;
  status: string;
  maxRedemptionsPerUser?: number;
  maxTotalRedemptions?: number;
  currentRedemptions: number;
  isDiscoveryOffer: boolean;
  distanceMeters?: number;
  shop: {
    id: string;
    name: string;
    logoUrl?: string;
    description?: string;
    category?: string;
    locations: Array<{
      id: string;
      name: string;
      address: string;
      city?: string;
      latitude: number;
      longitude: number;
      phone?: string;
    }>;
  };
}

function formatDiscount(type?: string, value?: number): string {
  if (!type) return 'Special Offer';
  switch (type) {
    case 'percentage': return `${value}% OFF`;
    case 'fixed': return `$${value} OFF`;
    case 'bogo': return 'Buy 1 Get 1 Free';
    case 'freebie': return 'Free Item';
    default: return 'Special Offer';
  }
}

function formatDistance(meters?: number): string {
  if (!meters) return '';
  if (meters < 1000) return `${meters}m away`;
  return `${(meters / 1000).toFixed(1)}km away`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function getDiscountBgColor(type?: string): string {
  switch (type) {
    case 'percentage': return '#6366f1';
    case 'fixed': return '#10b981';
    case 'bogo': return '#f59e0b';
    case 'freebie': return '#ec4899';
    default: return '#6366f1';
  }
}

export default function PromotionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentLocation } = useLocationStore();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchPromotion();
  }, [id]);

  async function fetchPromotion() {
    try {
      setLoading(true);
      const params = currentLocation
        ? `?latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}`
        : '';
      const result = await apiClient.get<{ success: boolean; data: Promotion }>(`/promotions/${id}${params}`);
      const promo = (result as any).data as Promotion;
      setPromotion(promo);

      // Track view (non-critical)
      apiClient.post(`/promotions/${id}/view`, { distanceMeters: promo.distanceMeters }).catch(() => {});
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load promotion');
    } finally {
      setLoading(false);
    }
  }

  function openDirections(lat: number, lon: number, name: string) {
    const url = `https://maps.google.com/?q=${lat},${lon}&label=${encodeURIComponent(name)}`;
    Linking.openURL(url);
  }

  function callPhone(phone: string) {
    Linking.openURL(`tel:${phone}`);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (error || !promotion) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error || 'Promotion not found'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isExpired = new Date(promotion.endDate) < new Date();
  const discountBg = getDiscountBgColor(promotion.discountType);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: discountBg }]}>
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {promotion.isDiscoveryOffer && (
          <View style={styles.discoveryBadge}>
            <Text style={styles.discoveryBadgeText}>Discovery Offer</Text>
          </View>
        )}
        <Text style={styles.discountLabel}>
          {formatDiscount(promotion.discountType, promotion.discountValue ? Number(promotion.discountValue) : undefined)}
        </Text>
        <Text style={styles.promotionTitle}>{promotion.title}</Text>
        {promotion.distanceMeters !== null && promotion.distanceMeters !== undefined && (
          <View style={styles.distanceRow}>
            <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.distanceText}>{formatDistance(promotion.distanceMeters)}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {/* Status */}
        {isExpired && (
          <View style={styles.expiredBanner}>
            <Ionicons name="time-outline" size={16} color="#92400e" />
            <Text style={styles.expiredText}>This promotion has expired</Text>
          </View>
        )}

        {/* Shop info */}
        <TouchableOpacity
          style={styles.shopCard}
          onPress={() => router.push(`/shop/${promotion.shop.id}`)}
        >
          <View style={styles.shopIcon}>
            <Text style={styles.shopIconText}>{promotion.shop.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.shopInfo}>
            <Text style={styles.shopName}>{promotion.shop.name}</Text>
            {promotion.shop.category && (
              <Text style={styles.shopCategory}>{promotion.shop.category}</Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this offer</Text>
          <Text style={styles.description}>{promotion.description}</Text>
        </View>

        {/* Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offer period</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Starts</Text>
              <Text style={styles.dateValue}>{formatDate(promotion.startDate)}</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color="#9ca3af" />
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Ends</Text>
              <Text style={[styles.dateValue, isExpired && { color: '#ef4444' }]}>
                {formatDate(promotion.endDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Redemption info */}
        {(promotion.maxRedemptionsPerUser || promotion.maxTotalRedemptions) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Redemption limits</Text>
            {promotion.maxRedemptionsPerUser && (
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={16} color="#6366f1" />
                <Text style={styles.infoText}>
                  Up to {promotion.maxRedemptionsPerUser}x per person
                </Text>
              </View>
            )}
            {promotion.maxTotalRedemptions && (
              <View style={styles.infoRow}>
                <Ionicons name="people-outline" size={16} color="#6366f1" />
                <Text style={styles.infoText}>
                  {promotion.currentRedemptions} / {promotion.maxTotalRedemptions} total redeemed
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Locations */}
        {promotion.shop.locations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Where to redeem</Text>
            {promotion.shop.locations.map((loc) => (
              <View key={loc.id} style={styles.locationCard}>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{loc.name}</Text>
                  <Text style={styles.locationAddress}>{loc.address}{loc.city ? `, ${loc.city}` : ''}</Text>
                </View>
                <View style={styles.locationActions}>
                  {loc.phone && (
                    <TouchableOpacity
                      style={styles.locationActionBtn}
                      onPress={() => callPhone(loc.phone!)}
                    >
                      <Ionicons name="call-outline" size={18} color="#6366f1" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.locationActionBtn}
                    onPress={() => openDirections(loc.latitude, loc.longitude, loc.name)}
                  >
                    <Ionicons name="navigate-outline" size={18} color="#6366f1" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Terms */}
        {promotion.terms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <Text style={styles.terms}>{promotion.terms}</Text>
          </View>
        )}

        {/* CTA */}
        {!isExpired && (
          <TouchableOpacity
            style={styles.redeemBtn}
            onPress={() => router.push(`/redemption/${promotion.id}` as any)}
          >
            <Ionicons name="gift-outline" size={20} color="#fff" />
            <Text style={styles.redeemBtnText}>Redeem This Offer</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 32 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { color: '#6b7280', marginTop: 12, textAlign: 'center' },
  backBtn: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#6366f1', borderRadius: 8 },
  backBtnText: { color: '#fff', fontWeight: '600' },

  header: { paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20 },
  headerBack: { position: 'absolute', top: 52, left: 16, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.2)' },
  discoveryBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 12 },
  discoveryBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  discountLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  promotionTitle: { color: '#fff', fontSize: 26, fontWeight: '800', lineHeight: 32, marginBottom: 8 },
  distanceRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  distanceText: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },

  content: { padding: 16 },
  expiredBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fef3c7', borderRadius: 10, padding: 12, marginBottom: 16 },
  expiredText: { color: '#92400e', fontSize: 14, fontWeight: '500' },

  shopCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  shopIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  shopIconText: { fontSize: 18, fontWeight: '700', color: '#6366f1' },
  shopInfo: { flex: 1 },
  shopName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  shopCategory: { fontSize: 13, color: '#6b7280', marginTop: 2 },

  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  description: { fontSize: 15, color: '#374151', lineHeight: 22 },

  dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateItem: { flex: 1 },
  dateLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 4 },
  dateValue: { fontSize: 15, fontWeight: '600', color: '#111827' },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  infoText: { fontSize: 14, color: '#374151' },

  locationCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  locationInfo: { flex: 1 },
  locationName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  locationAddress: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  locationActions: { flexDirection: 'row', gap: 8 },
  locationActionBtn: { padding: 8, backgroundColor: '#e0e7ff', borderRadius: 8 },

  terms: { fontSize: 13, color: '#6b7280', lineHeight: 20 },

  redeemBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#6366f1', borderRadius: 14, paddingVertical: 16, marginTop: 8 },
  redeemBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
