import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLocationStore } from '../../src/stores/locationStore';
import apiClient from '../../src/lib/api';

interface ShopLocation {
  id: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  latitude: number;
  longitude: number;
  phone?: string;
}

interface Shop {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  category?: string;
  locations: ShopLocation[];
  activePromotions: Array<{
    id: string;
    title: string;
    discountType?: string;
    discountValue?: number;
    endDate: string;
    isDiscoveryOffer: boolean;
  }>;
}

function formatDiscount(type?: string, value?: number): string {
  if (!type) return 'Special Offer';
  switch (type) {
    case 'percentage': return `${value}% OFF`;
    case 'fixed': return `$${value} OFF`;
    case 'bogo': return 'BOGO';
    case 'freebie': return 'Free Item';
    default: return 'Special Offer';
  }
}

export default function ShopDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentLocation } = useLocationStore();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchShop();
  }, [id]);

  async function fetchShop() {
    try {
      setLoading(true);
      const params = currentLocation
        ? `?latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}`
        : '';
      const result = await apiClient.get<{ success: boolean; data: Shop }>(`/shops/${id}/public${params}`);
      setShop((result as any).data as Shop);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load shop');
    } finally {
      setLoading(false);
    }
  }

  async function toggleFollow() {
    try {
      if (following) {
        await apiClient.delete(`/users/shops/${id}/follow`);
      } else {
        await apiClient.post(`/users/shops/${id}/follow`);
      }
      setFollowing(!following);
    } catch {
      // silently fail if not logged in
    }
  }

  function openDirections(lat: number, lon: number, name: string) {
    Linking.openURL(`https://maps.google.com/?q=${lat},${lon}&label=${encodeURIComponent(name)}`);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (error || !shop) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error || 'Shop not found'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.followBtn} onPress={toggleFollow}>
          <Ionicons
            name={following ? 'heart' : 'heart-outline'}
            size={22}
            color={following ? '#ef4444' : '#fff'}
          />
        </TouchableOpacity>

        <View style={styles.shopAvatar}>
          <Text style={styles.shopAvatarText}>{shop.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.shopName}>{shop.name}</Text>
        {shop.category && <Text style={styles.shopCategory}>{shop.category}</Text>}
      </View>

      <View style={styles.content}>
        {/* Description */}
        {shop.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{shop.description}</Text>
          </View>
        )}

        {/* Active Promotions */}
        {shop.activePromotions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Offers</Text>
            {shop.activePromotions.map((promo) => (
              <TouchableOpacity
                key={promo.id}
                style={styles.promoCard}
                onPress={() => router.push(`/promotion/${promo.id}`)}
              >
                <View style={styles.promoDiscount}>
                  <Text style={styles.promoDiscountText}>
                    {formatDiscount(promo.discountType, promo.discountValue ? Number(promo.discountValue) : undefined)}
                  </Text>
                </View>
                <View style={styles.promoInfo}>
                  <Text style={styles.promoTitle}>{promo.title}</Text>
                  <Text style={styles.promoExpiry}>
                    Ends {new Date(promo.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
                {promo.isDiscoveryOffer && (
                  <View style={styles.discoveryDot} />
                )}
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Locations */}
        {shop.locations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Locations</Text>
            {shop.locations.map((loc) => (
              <View key={loc.id} style={styles.locationCard}>
                <View style={styles.locationIcon}>
                  <Ionicons name="location" size={18} color="#6366f1" />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{loc.name}</Text>
                  <Text style={styles.locationAddress}>
                    {loc.address}{loc.city ? `, ${loc.city}` : ''}
                  </Text>
                  {loc.phone && (
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${loc.phone}`)}>
                      <Text style={styles.locationPhone}>{loc.phone}</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.directionsBtn}
                  onPress={() => openDirections(loc.latitude, loc.longitude, loc.name)}
                >
                  <Ionicons name="navigate" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
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

  header: { backgroundColor: '#6366f1', paddingTop: 56, paddingBottom: 32, alignItems: 'center', paddingHorizontal: 20 },
  headerBack: { position: 'absolute', top: 52, left: 16, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.2)' },
  followBtn: { position: 'absolute', top: 52, right: 16, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.2)' },
  shopAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  shopAvatarText: { fontSize: 30, fontWeight: '800', color: '#6366f1' },
  shopName: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'center' },
  shopCategory: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 },

  content: { padding: 16 },

  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  description: { fontSize: 15, color: '#374151', lineHeight: 22 },

  promoCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  promoDiscount: { backgroundColor: '#e0e7ff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginRight: 12 },
  promoDiscountText: { color: '#6366f1', fontSize: 12, fontWeight: '700' },
  promoInfo: { flex: 1 },
  promoTitle: { fontSize: 14, fontWeight: '600', color: '#111827' },
  promoExpiry: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  discoveryDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#a855f7', marginRight: 8 },

  locationCard: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  locationIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2 },
  locationInfo: { flex: 1 },
  locationName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  locationAddress: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  locationPhone: { fontSize: 13, color: '#6366f1', marginTop: 4 },
  directionsBtn: { padding: 10, backgroundColor: '#6366f1', borderRadius: 10, marginLeft: 8 },
});
