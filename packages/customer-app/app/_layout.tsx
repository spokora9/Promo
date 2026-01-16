import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { requestNotificationPermissions } from '@/services/notifications';

const queryClient = new QueryClient();

export default function RootLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Request notification permissions on app start
    requestNotificationPermissions();
  }, []);

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
