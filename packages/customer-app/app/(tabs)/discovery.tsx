import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useLocationStore } from '@/stores/locationStore';
import { getDiscoveryShops } from '@/lib/api';
import { ShopCard } from '@/components/ShopCard';
import { DiscoveryModeSelector } from '@/components/DiscoveryModeSelector';
import { useTheme } from '@/hooks/useTheme';

export default function DiscoveryScreen() {
  const { colors } = useTheme();
  const discoveryMode = useDiscoveryStore((state) => state.mode);
  const setDiscoveryMode = useDiscoveryStore((state) => state.setMode);
  const currentLocation = useLocationStore((state) => state.currentLocation);

  const { data: shops, isLoading } = useQuery({
    queryKey: ['discovery-shops', currentLocation, discoveryMode],
    queryFn: () => getDiscoveryShops(currentLocation, discoveryMode),
    enabled: !!currentLocation && discoveryMode !== 'off',
  });

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
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.9)',
    },
    content: {
      flex: 1,
    },
    section: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    modeSection: {
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modeSectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    infoCard: {
      backgroundColor: '#EEF2FF',
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
    },
    infoText: {
      fontSize: 14,
      color: '#4338CA',
      lineHeight: 20,
    },
    emptyState: {
      padding: 40,
      alignItems: 'center',
    },
    emptyStateIcon: {
      marginBottom: 12,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discovery Mode</Text>
        <Text style={styles.headerSubtitle}>
          Explore new shops offering special discovery deals
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Mode Selector */}
        <View style={styles.modeSection}>
          <Text style={styles.modeSectionTitle}>Choose Your Mode</Text>
          <DiscoveryModeSelector
            currentMode={discoveryMode}
            onModeChange={setDiscoveryMode}
          />
        </View>

        {/* Info Card */}
        {discoveryMode !== 'off' && (
          <View style={styles.section}>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                {discoveryMode === 'active'
                  ? '🔔 You\'ll receive notifications when you\'re near shops with discovery offers'
                  : '🔕 Exploring silently - no notifications, but you can review shops later'}
              </Text>
            </View>
          </View>
        )}

        {/* Discovery Shops */}
        <View style={styles.section}>
          {discoveryMode === 'off' ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="compass-outline"
                size={64}
                color={colors.textSecondary}
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateTitle}>Discovery Mode is Off</Text>
              <Text style={styles.emptyStateText}>
                Enable Active or Silent mode above to start discovering{'\n'}
                new shops with exclusive first-time offers!
              </Text>
            </View>
          ) : isLoading ? (
            <Text style={styles.emptyStateText}>Finding nearby shops...</Text>
          ) : shops && shops.length > 0 ? (
            shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="storefront-outline"
                size={64}
                color={colors.textSecondary}
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateTitle}>No New Shops Nearby</Text>
              <Text style={styles.emptyStateText}>
                We'll notify you when new shops with{'\n'}
                discovery offers are in your area
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
