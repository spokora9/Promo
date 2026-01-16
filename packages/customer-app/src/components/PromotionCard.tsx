import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { calculateDistance } from '@/services/location';
import { useLocationStore } from '@/stores/locationStore';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_item';
  discountValue: number;
  validUntil: string;
  radius: number;
  shop: {
    name: string;
    locations: Array<{ latitude: number; longitude: number }>;
  };
}

interface PromotionCardProps {
  promotion: Promotion;
  onPress: () => void;
}

export const PromotionCard = ({ promotion, onPress }: PromotionCardProps) => {
  const { colors } = useTheme();
  const currentLocation = useLocationStore((state) => state.currentLocation);

  const getDistance = () => {
    if (!currentLocation || !promotion.shop.locations[0]) return null;

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      promotion.shop.locations[0].latitude,
      promotion.shop.locations[0].longitude
    );

    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  const getDiscountText = () => {
    if (promotion.discountType === 'percentage') {
      return `${promotion.discountValue}% OFF`;
    } else if (promotion.discountType === 'fixed_amount') {
      return `$${promotion.discountValue} OFF`;
    } else {
      return 'FREE ITEM';
    }
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
    badge: {
      backgroundColor: '#10B981',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    badgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '700',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
      flex: 1,
      marginRight: 12,
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
    shopName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{promotion.title}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{getDiscountText()}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {promotion.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.shopName}>{promotion.shop.name}</Text>
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
