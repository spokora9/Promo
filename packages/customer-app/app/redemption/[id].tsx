import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { redeemPromotion } from '@/lib/api';
import { useLocationStore } from '@/stores/locationStore';

const EXPIRY_SECONDS = 10 * 60; // 10 minutes

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
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

export default function RedemptionScreen() {
  const { id: promotionId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const currentLocation = useLocationStore((state) => state.currentLocation);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redemption, setRedemption] = useState<{
    code: string;
    qrCodeBase64: string;
    expiresAt: string;
    promotion: { title: string; discountType?: string; discountValue?: number; shopName: string };
  } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (promotionId) fetchRedemption();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [promotionId]);

  async function fetchRedemption() {
    try {
      setLoading(true);
      setError(null);
      const response = await redeemPromotion(
        promotionId!,
        currentLocation ?? undefined
      );
      const data = (response as any).data;
      setRedemption(data);

      // Start countdown from expiresAt
      const expiresAt = new Date(data.expiresAt).getTime();
      const startCountdown = () => {
        intervalRef.current = setInterval(() => {
          const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
          setSecondsLeft(remaining);
          if (remaining <= 0) {
            clearInterval(intervalRef.current!);
            setIsExpired(true);
          }
        }, 1000);
      };
      startCountdown();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to generate redemption code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleRefresh() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsExpired(false);
    setSecondsLeft(EXPIRY_SECONDS);
    setRedemption(null);
    fetchRedemption();
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Generating your code...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={52} color="#ef4444" />
        <Text style={styles.errorTitle}>Cannot Redeem</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!redemption) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Redeem Offer</Text>
      </View>

      {/* Discount badge */}
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>
          {formatDiscount(redemption.promotion.discountType, redemption.promotion.discountValue)}
        </Text>
        <Text style={styles.shopName}>{redemption.promotion.shopName}</Text>
        <Text style={styles.promoTitle}>{redemption.promotion.title}</Text>
      </View>

      {/* QR Code */}
      <View style={styles.qrCard}>
        <Text style={styles.instructionText}>Show this to staff to redeem</Text>

        {isExpired ? (
          <View style={styles.expiredBox}>
            <Ionicons name="time-outline" size={48} color="#9ca3af" />
            <Text style={styles.expiredTitle}>Code Expired</Text>
            <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh}>
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text style={styles.refreshBtnText}>Get New Code</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {redemption.qrCodeBase64 ? (
              <Image
                source={{ uri: redemption.qrCodeBase64 }}
                style={styles.qrImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code-outline" size={80} color="#6366f1" />
              </View>
            )}

            {/* Text code */}
            <View style={styles.codeBox}>
              <Text style={styles.codeLabel}>CODE</Text>
              <Text style={styles.codeText}>{redemption.code}</Text>
            </View>

            {/* Countdown */}
            <View style={[styles.countdownRow, secondsLeft < 60 && styles.countdownUrgent]}>
              <Ionicons
                name="time-outline"
                size={16}
                color={secondsLeft < 60 ? '#ef4444' : '#6b7280'}
              />
              <Text style={[styles.countdownText, secondsLeft < 60 && styles.countdownTextUrgent]}>
                Expires in {formatCountdown(secondsLeft)}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Footer note */}
      <View style={styles.footer}>
        <Ionicons name="shield-checkmark-outline" size={16} color="#6b7280" />
        <Text style={styles.footerText}>
          Single-use code · Valid at participating locations only
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  loadingText: { color: '#6b7280', fontSize: 15, marginTop: 8 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  errorText: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 20 },
  backBtn: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#6366f1', borderRadius: 10 },
  backBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  header: { backgroundColor: '#6366f1', paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerBack: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },

  discountBadge: { backgroundColor: '#6366f1', paddingHorizontal: 20, paddingBottom: 28, alignItems: 'center' },
  discountText: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  shopName: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  promoTitle: { fontSize: 15, color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginTop: 4, textAlign: 'center' },

  qrCard: { backgroundColor: '#fff', margin: 16, borderRadius: 20, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  instructionText: { fontSize: 14, color: '#6b7280', marginBottom: 20, fontWeight: '500' },

  qrImage: { width: 220, height: 220, marginBottom: 20 },
  qrPlaceholder: { width: 220, height: 220, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, marginBottom: 20 },

  codeBox: { backgroundColor: '#f3f4f6', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center', marginBottom: 16, width: '100%' },
  codeLabel: { fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  codeText: { fontSize: 28, fontWeight: '900', color: '#111827', letterSpacing: 3, fontVariant: ['tabular-nums'] },

  countdownRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#f9fafb' },
  countdownUrgent: { backgroundColor: '#fef2f2' },
  countdownText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  countdownTextUrgent: { color: '#ef4444', fontWeight: '700' },

  expiredBox: { alignItems: 'center', gap: 12, paddingVertical: 24 },
  expiredTitle: { fontSize: 18, fontWeight: '700', color: '#374151' },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#6366f1', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginTop: 4 },
  refreshBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  footer: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 24, justifyContent: 'center' },
  footerText: { fontSize: 12, color: '#9ca3af', textAlign: 'center', lineHeight: 18 },
});
