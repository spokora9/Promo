import { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useLocationStore } from '@/stores/locationStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { getNearbyPromotions } from '@/lib/api';
import { PromotionCard } from '@/components/PromotionCard';
import { LocationPermissionBanner } from '@/components/LocationPermissionBanner';
import { DiscoveryModeBanner } from '@/components/DiscoveryModeBanner';
import { useTheme } from '@/hooks/useTheme';

const DISCOUNT_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'percentage', label: '% Off' },
  { key: 'fixed', label: '$ Off' },
  { key: 'bogo', label: 'BOGO' },
  { key: 'freebie', label: 'Free' },
];

const RADIUS_OPTIONS = [
  { value: 500, label: '500m' },
  { value: 1000, label: '1km' },
  { value: 2000, label: '2km' },
  { value: 5000, label: '5km' },
  { value: 10000, label: '10km' },
];

export default function HomeScreen() {
  const { colors } = useTheme();
  const currentLocation = useLocationStore((state) => state.currentLocation);
  const discoveryMode = useDiscoveryStore((state) => state.mode);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [radiusMeters, setRadiusMeters] = useState(5000);
  const [showRadiusPicker, setShowRadiusPicker] = useState(false);

  const { data: promotions, refetch, isLoading } = useQuery({
    queryKey: ['nearby-promotions', currentLocation, radiusMeters],
    queryFn: () => getNearbyPromotions(currentLocation, radiusMeters),
    enabled: !!currentLocation,
  });

  const filteredPromotions = useMemo(() => {
    if (!promotions) return [];
    return promotions.filter((p: any) => {
      const matchesSearch =
        !searchQuery ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shopName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        activeFilter === 'all' || p.discountType === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [promotions, searchQuery, activeFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>LoCo</Text>
            {currentLocation && (
              <View style={styles.locationRow}>
                <Ionicons name="location" size={13} color="rgba(255,255,255,0.85)" />
                <Text style={styles.locationText}>
                  {currentLocation.city || 'Current Location'}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.radiusBtn}
            onPress={() => setShowRadiusPicker(!showRadiusPicker)}
          >
            <Ionicons name="radio-button-on-outline" size={16} color="#fff" />
            <Text style={styles.radiusBtnText}>
              {RADIUS_OPTIONS.find((r) => r.value === radiusMeters)?.label}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Radius picker */}
        {showRadiusPicker && (
          <View style={styles.radiusPicker}>
            {RADIUS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.radiusOption, radiusMeters === opt.value && styles.radiusOptionActive]}
                onPress={() => { setRadiusMeters(opt.value); setShowRadiusPicker(false); }}
              >
                <Text style={[styles.radiusOptionText, radiusMeters === opt.value && styles.radiusOptionTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search promotions or shops..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {DISCOUNT_FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.key)}
            >
              <Text style={[styles.filterChipText, activeFilter === f.key && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Permission Banner */}
        {!currentLocation && <LocationPermissionBanner />}

        {/* Discovery Mode Banner */}
        {discoveryMode !== 'off' && <DiscoveryModeBanner />}

        {/* Promotions list */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery || activeFilter !== 'all' ? 'Results' : 'Nearby Promotions'}
              {filteredPromotions.length > 0 && (
                <Text style={styles.countBadge}> ({filteredPromotions.length})</Text>
              )}
            </Text>
            <TouchableOpacity
              style={styles.seeAllBtn}
              onPress={() => router.push('/discovery')}
            >
              <Text style={styles.seeAllText}>Discover</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {isLoading && currentLocation && (
            <View style={styles.loadingState}>
              <Text style={styles.loadingText}>Finding promotions near you...</Text>
            </View>
          )}

          {!isLoading && filteredPromotions.length > 0 ? (
            filteredPromotions.map((promotion: any) => (
              <PromotionCard
                key={`${promotion.id}-${promotion.locationId}`}
                promotion={promotion}
                onPress={() => router.push(`/promotion/${promotion.id}`)}
              />
            ))
          ) : (
            !isLoading && currentLocation && (
              <View style={styles.emptyState}>
                <Ionicons name="pricetag-outline" size={52} color="#d1d5db" />
                <Text style={styles.emptyTitle}>No promotions found</Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery
                    ? 'Try a different search or clear filters'
                    : `No active offers within ${RADIUS_OPTIONS.find((r) => r.value === radiusMeters)?.label}. Try a larger radius!`}
                </Text>
                {(searchQuery || activeFilter !== 'all') && (
                  <TouchableOpacity
                    style={styles.clearFiltersBtn}
                    onPress={() => { setSearchQuery(''); setActiveFilter('all'); }}
                  >
                    <Text style={styles.clearFiltersBtnText}>Clear Filters</Text>
                  </TouchableOpacity>
                )}
              </View>
            )
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },

  header: { paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locationText: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },

  radiusBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  radiusBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  radiusPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  radiusOption: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)' },
  radiusOptionActive: { backgroundColor: '#fff' },
  radiusOptionText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '500' },
  radiusOptionTextActive: { color: '#6366f1', fontWeight: '700' },

  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827', padding: 0 },

  filterRow: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  filterScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: 'transparent' },
  filterChipActive: { backgroundColor: '#e0e7ff', borderColor: '#6366f1' },
  filterChipText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  filterChipTextActive: { color: '#6366f1', fontWeight: '700' },

  content: { flex: 1 },
  section: { padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  countBadge: { fontSize: 15, color: '#9ca3af', fontWeight: '500' },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center' },
  seeAllText: { fontSize: 14, color: '#6366f1', marginRight: 2 },

  loadingState: { paddingVertical: 32, alignItems: 'center' },
  loadingText: { color: '#9ca3af', fontSize: 14 },

  emptyState: { paddingVertical: 40, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#374151' },
  emptySubtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center', lineHeight: 20, paddingHorizontal: 16 },
  clearFiltersBtn: { marginTop: 8, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#6366f1', borderRadius: 8 },
  clearFiltersBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
