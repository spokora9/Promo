import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { requestNotificationPermissions, addNotificationResponseReceivedListener } from '@/services/notifications';
import { requestLocationPermissions, getCurrentLocation } from '@/services/location';
import { useLocationStore } from '@/stores/locationStore';

const queryClient = new QueryClient();

export default function RootLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setCurrentLocation = useLocationStore((state) => state.setCurrentLocation);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      // Initialize notifications
      requestNotificationPermissions().catch(console.error);

      // Initialize location tracking
      requestLocationPermissions()
        .then((granted) => {
          if (granted) {
            return getCurrentLocation();
          }
          return null;
        })
        .then((location) => {
          if (location) {
            setCurrentLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy || undefined,
              timestamp: location.timestamp,
            });
          }
        })
        .catch(console.error);

      // Handle notification taps — navigate to promotion
      const subscription = addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as any;
        if (data?.promotionId) {
          router.push(`/promotion/${data.promotionId}` as any);
        }
      });

      return () => subscription.remove();
    }
  }, [isAuthenticated]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="auth/login" />
              <Stack.Screen name="auth/register" />
            </>
          ) : (
            <>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="promotion/[id]" />
              <Stack.Screen name="redemption/[id]" />
              <Stack.Screen name="shop/[id]" />
              <Stack.Screen name="settings/index" />
              <Stack.Screen name="settings/discovery" />
              <Stack.Screen name="settings/notifications" />
            </>
          )}
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
