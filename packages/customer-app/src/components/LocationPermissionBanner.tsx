import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { requestLocationPermissions, getCurrentLocation } from '@/services/location';
import { useLocationStore } from '@/stores/locationStore';
import { useTheme } from '@/hooks/useTheme';

export const LocationPermissionBanner = () => {
  const { colors } = useTheme();
  const setCurrentLocation = useLocationStore((state) => state.setCurrentLocation);

  const handleEnableLocation = async () => {
    const hasPermission = await requestLocationPermissions();
    if (hasPermission) {
      const location = await getCurrentLocation();
      if (location) {
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy || undefined,
          timestamp: location.timestamp,
        });
      }
    }
  };

  const styles = StyleSheet.create({
    banner: {
      backgroundColor: '#FEF3C7',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#FCD34D',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      color: '#92400E',
      marginBottom: 4,
    },
    description: {
      fontSize: 12,
      color: '#92400E',
      lineHeight: 16,
    },
    button: {
      backgroundColor: '#F59E0B',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
      marginTop: 12,
      alignSelf: 'flex-start',
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <Ionicons name="location-outline" size={24} color="#F59E0B" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Location Permission Required</Text>
          <Text style={styles.description}>
            Enable location access to discover nearby promotions and deals
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleEnableLocation}>
        <Text style={styles.buttonText}>Enable Location</Text>
      </TouchableOpacity>
    </View>
  );
};
