import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getFavoriteShops, getFavoritePromotions } from '@/lib/api';
import { ShopCard } from '@/components/ShopCard';
import { PromotionCard } from '@/components/PromotionCard';
import { useTheme } from '@/hooks/useTheme';

export default function FavoritesScreen() {
  const { colors } = useTheme();

  const { data: favoriteShops } = useQuery({
    queryKey: ['favorite-shops'],
    queryFn: getFavoriteShops,
  });

  const { data: favoritePromotions } = useQuery({
    queryKey: ['favorite-promotions'],
    queryFn: getFavoritePromotions,
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
    },
    content: {
      flex: 1,
    },
    section: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    emptyState: {
      padding: 40,
      alignItems: 'center',
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 12,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 8,
    },
  });

  const hasNoFavorites =
    (!favoriteShops || favoriteShops.length === 0) &&
    (!favoritePromotions || favoritePromotions.length === 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      <ScrollView style={styles.content}>
        {hasNoFavorites ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              No favorites yet!{'\n'}
              Start exploring and save your favorite{'\n'}
              shops and promotions here.
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 20,
                paddingVertical: 12,
                paddingHorizontal: 24,
                backgroundColor: colors.primary,
                borderRadius: 8,
              }}
              onPress={() => router.push('/discovery')}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                Explore Shops
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Favorite Shops */}
            {favoriteShops && favoriteShops.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shops</Text>
                {favoriteShops.map((shop) => (
                  <ShopCard
                    key={shop.id}
                    shop={shop}
                    onPress={() => router.push(`/shop/${shop.id}`)}
                  />
                ))}
              </View>
            )}

            {/* Divider */}
            {favoriteShops &&
              favoriteShops.length > 0 &&
              favoritePromotions &&
              favoritePromotions.length > 0 && <View style={styles.divider} />}

            {/* Favorite Promotions */}
            {favoritePromotions && favoritePromotions.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Promotions</Text>
                {favoritePromotions.map((promotion) => (
                  <PromotionCard
                    key={promotion.id}
                    promotion={promotion}
                    onPress={() => router.push(`/promotion/${promotion.id}`)}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
