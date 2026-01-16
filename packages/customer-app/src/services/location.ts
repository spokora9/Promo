import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Platform, Alert } from 'react-native';
import { useLocationStore } from '@/stores/locationStore';
import { updateUserLocation } from '@/lib/api';

const LOCATION_TASK_NAME = 'background-location-task';
const GEOFENCE_TASK_NAME = 'geofence-task';

// Background location task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const location = locations[0];

    if (location) {
      // Update local store
      useLocationStore.getState().setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
        timestamp: location.timestamp,
      });

      // Send to backend
      try {
        await updateUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy || undefined,
        });
      } catch (err) {
        console.error('Failed to update user location:', err);
      }
    }
  }
});

// Geofence task
TaskManager.defineTask(GEOFENCE_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Geofence error:', error);
    return;
  }

  if (data) {
    const { eventType, region } = data as {
      eventType: Location.GeofencingEventType;
      region: Location.LocationRegion;
    };

    if (eventType === Location.GeofencingEventType.Enter) {
      console.log('Entered geofence:', region.identifier);
      // Handle entering a shop's geofence
      // This will trigger notification if user has discovery mode active
    }
  }
});

export const requestLocationPermissions = async (): Promise<boolean> => {
  try {
    // Request foreground permissions
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        'LoCo needs access to your location to show you nearby promotions.',
        [{ text: 'OK' }]
      );
      return false;
    }

    // Request background permissions (iOS requires this separately)
    if (Platform.OS === 'ios') {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

      if (backgroundStatus !== 'granted') {
        Alert.alert(
          'Background Location',
          'For the best experience, enable "Always" location access to receive notifications when you\'re near deals.',
          [
            { text: 'Not Now', style: 'cancel' },
            { text: 'Enable', onPress: () => Location.requestBackgroundPermissionsAsync() },
          ]
        );
      }
    }

    return true;
  } catch (error) {
    console.error('Error requesting location permissions:', error);
    return false;
  }
};

export const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== 'granted') {
      const hasPermission = await requestLocationPermissions();
      if (!hasPermission) return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return location;
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

export const startBackgroundLocationTracking = async (): Promise<boolean> => {
  try {
    const { status } = await Location.getBackgroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Background location permission not granted');
      return false;
    }

    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    if (!isTaskDefined) {
      console.error('Background location task not defined');
      return false;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5 * 60 * 1000, // 5 minutes
      distanceInterval: 100, // 100 meters
      foregroundService: Platform.OS === 'android' ? {
        notificationTitle: 'LoCo is active',
        notificationBody: 'Finding nearby deals for you',
        notificationColor: '#6366F1',
      } : undefined,
      pausesUpdatesAutomatically: true,
      activityType: Location.ActivityType.Other,
      showsBackgroundLocationIndicator: Platform.OS === 'ios',
    });

    console.log('Background location tracking started');
    return true;
  } catch (error) {
    console.error('Error starting background location:', error);
    return false;
  }
};

export const stopBackgroundLocationTracking = async (): Promise<void> => {
  try {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log('Background location tracking stopped');
    }
  } catch (error) {
    console.error('Error stopping background location:', error);
  }
};

export const startGeofencing = async (
  regions: Location.LocationRegion[]
): Promise<boolean> => {
  try {
    const { status } = await Location.getBackgroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Background location permission not granted for geofencing');
      return false;
    }

    await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, regions);
    console.log(`Geofencing started for ${regions.length} regions`);
    return true;
  } catch (error) {
    console.error('Error starting geofencing:', error);
    return false;
  }
};

export const stopGeofencing = async (): Promise<void> => {
  try {
    const hasStarted = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK_NAME);

    if (hasStarted) {
      await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
      console.log('Geofencing stopped');
    }
  } catch (error) {
    console.error('Error stopping geofencing:', error);
  }
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};
