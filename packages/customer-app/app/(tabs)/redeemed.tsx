import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { getUserRedemptions } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function formatDiscount(type?: string, value?: number): string {
  if (!type) return 'Special Offer';
  switch (type) {
    case 'percentage': return `${value}% OFF`;
    case 'fixed': return `$${value} OFF`;
    case 'bogo': return 'Buy 1 Get 1';
    case 'freebie': return 'Free Item';
    default: return 'Special Offer';
  }
}

export default function RedeemedScreen() {
  const { colors } = useTheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['user-redemptions'],
    queryFn: getUserRedemptions,
    enabled: isAuthenticated,
  });

  const redemptions = (data as any)?.data ?? [];

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <Text style={styles.headerTitle}>Redeemed</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="lock-closed-outline" size={56} color="#d1d5db" />
          <Text style={styles.emptyTitle}>Sign in to see your redemptions</Text>
          <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('/auth/login')}>
            <Text style={styles.signInBtnText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Redeemed</Text>
        <Text style={styles.headerSubtitle}>
          {redemptions.length} offer{redemptions.length !== 1 ? 's' : ''} redeemed
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : redemptions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={56} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No redemptions yet</Text>
          <Text style={styles.emptySubtitle}>
            Find a nearby promotion and redeem it to see it here
          </Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => router.push('/')}>
            <Text style={styles.exploreBtnText}>Explore Promotions</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={redemptions}
          keyExtractor={(item: any) => item.id}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/promotion/${item.promotion.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.cardLeft}>
                <View style={styles.shopIcon}>
                  <Text style={styles.shopIconText}>
                    {item.promotion.shop.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.promotion.title}</Text>
                <Text style={styles.cardShop}>{item.promotion.shop.name}</Text>
                <Text style={styles.cardDate}>{formatDate(item.redeemedAt)}</Text>
              </View>
              <View style={styles.cardRight}>
                <View style={[styles.discountBadge, !item.isVerified && styles.discountBadgePending]}>
                  <Text style={styles.discountBadgeText}>
                    {formatDiscount(item.promotion.discountType, item.promotion.discountValue)}
                  </Text>
                </View>
                {item.isVerified ? (
                  <View style={styles.verifiedRow}>
                    <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                ) : (
                  <Text style={styles.pendingText}>Pending</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  loadingState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151' },
  emptySubtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center', lineHeight: 20 },
  exploreBtn: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#6366f1', borderRadius: 10 },
  exploreBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  signInBtn: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#6366f1', borderRadius: 10 },
  signInBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  listContent: { padding: 16, gap: 10 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 14, gap: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardLeft: { justifyContent: 'center' },
  shopIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center' },
  shopIconText: { fontSize: 18, fontWeight: '700', color: '#6366f1' },
  cardBody: { flex: 1, justifyContent: 'center', gap: 2 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  cardShop: { fontSize: 13, color: '#6b7280' },
  cardDate: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  cardRight: { alignItems: 'flex-end', justifyContent: 'center', gap: 6 },
  discountBadge: { backgroundColor: '#e0e7ff', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  discountBadgePending: { backgroundColor: '#f3f4f6' },
  discountBadgeText: { fontSize: 12, fontWeight: '700', color: '#6366f1' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  verifiedText: { fontSize: 11, color: '#10b981', fontWeight: '600' },
  pendingText: { fontSize: 11, color: '#9ca3af' },
});
