import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { calculateDistance } from '@/services/location';
import { useLocationStore } from '@/stores/locationStore';

interface Shop {
  id: string;
  name: string;
  category?: string;
  description?: string;
  locations: Array<{ latitude: number; longitude: number }>;
  activePromotionsCount?: number;
}

interface ShopCardProps {
  shop: Shop;
  onPress?: () => void;
}

export const ShopCard = ({ shop, onPress }: ShopCardProps) => {
  const { colors } = useTheme();
  const currentLocation = useLocationStore((state) => state.currentLocation);

  const getDistance = () => {
    if (!currentLocation || !shop.locations[0]) return null;

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      shop.locations[0].latitude,
      shop.locations[0].longitude
    );

    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
      flex: 1,
    },
    category: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    promotionCount: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#EEF2FF',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    promotionCountText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
      marginLeft: 4,
    },
    distance: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    distanceText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 4,
    },
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{shop.name}</Text>
          {shop.category && <Text style={styles.category}>{shop.category}</Text>}
        </View>
      </View>

      {shop.description && (
        <Text style={styles.description} numberOfLines={2}>
          {shop.description}
        </Text>
      )}

      <View style={styles.footer}>
        {shop.activePromotionsCount !== undefined && shop.activePromotionsCount > 0 && (
          <View style={styles.promotionCount}>
            <Ionicons name="pricetag" size={14} color={colors.primary} />
            <Text style={styles.promotionCountText}>
              {shop.activePromotionsCount} {shop.activePromotionsCount === 1 ? 'offer' : 'offers'}
            </Text>
          </View>
        )}
        {getDistance() && (
          <View style={styles.distance}>
            <Ionicons name="location" size={14} color={colors.textSecondary} />
            <Text style={styles.distanceText}>{getDistance()}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
