import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
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

export default function HomeScreen() {
  const { colors } = useTheme();
  const currentLocation = useLocationStore((state) => state.currentLocation);
  const discoveryMode = useDiscoveryStore((state) => state.mode);
  const [refreshing, setRefreshing] = useState(false);

  const { data: promotions, refetch, isLoading } = useQuery({
    queryKey: ['nearby-promotions', currentLocation],
    queryFn: () => getNearbyPromotions(currentLocation),
    enabled: !!currentLocation,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: colors.primary,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.9)',
      flexDirection: 'row',
      alignItems: 'center',
    },
    content: {
      flex: 1,
    },
    section: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    seeAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    seeAllText: {
      fontSize: 14,
      color: colors.primary,
      marginRight: 4,
    },
    emptyState: {
      padding: 40,
      alignItems: 'center',
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 12,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LoCo</Text>
        {currentLocation && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location" size={14} color="rgba(255,255,255,0.9)" />
            <Text style={styles.headerSubtitle}>
              {' '}
              {currentLocation.city || 'Current Location'}
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Permission Banner */}
        {!currentLocation && <LocationPermissionBanner />}

        {/* Discovery Mode Banner */}
        {discoveryMode !== 'off' && <DiscoveryModeBanner />}

        {/* Nearby Promotions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Promotions</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => router.push('/discovery')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {isLoading && currentLocation && (
            <Text style={styles.emptyStateText}>Loading promotions...</Text>
          )}

          {promotions && promotions.length > 0 ? (
            promotions.slice(0, 5).map((promotion) => (
              <PromotionCard
                key={promotion.id}
                promotion={promotion}
                onPress={() => router.push(`/promotion/${promotion.id}`)}
              />
            ))
          ) : (
            currentLocation && (
              <View style={styles.emptyState}>
                <Ionicons name="search" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyStateText}>
                  No promotions nearby right now.{'\n'}
                  Try enabling Discovery Mode to explore!
                </Text>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}
