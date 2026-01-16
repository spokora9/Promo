import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import { registerPushToken } from '@/lib/api';

// Configure how notifications are displayed
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    if (!Device.isDevice) {
      console.log('Notifications only work on physical devices');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Notification Permission',
        'Enable notifications to receive alerts about nearby deals!',
        [{ text: 'OK' }]
      );
      return false;
    }

    // Get push token and register with backend
    const token = await registerForPushNotifications();
    if (token) {
      await registerPushToken(token);
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const registerForPushNotifications = async (): Promise<string | null> => {
  try {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EAS_PROJECT_ID,
    });

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366F1',
      });

      // Create channel for discovery mode notifications
      await Notifications.setNotificationChannelAsync('discovery', {
        name: 'Discovery Mode',
        description: 'Notifications for nearby discovery offers',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366F1',
      });

      // Create channel for promotion alerts
      await Notifications.setNotificationChannelAsync('promotions', {
        name: 'Promotions',
        description: 'Alerts for time-sensitive promotions',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10B981',
      });
    }

    return token.data;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
};

export const scheduleLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, any>,
  channelId: string = 'default'
): Promise<string> => {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // Show immediately
  });

  return notificationId;
};

export const cancelNotification = async (notificationId: string): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription => {
  return Notifications.addNotificationReceivedListener(callback);
};

export const addNotificationResponseReceivedListener = (
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

export const getBadgeCount = async (): Promise<number> => {
  return await Notifications.getBadgeCountAsync();
};

export const setBadgeCount = async (count: number): Promise<void> => {
  await Notifications.setBadgeCountAsync(count);
};

export const clearBadge = async (): Promise<void> => {
  await Notifications.setBadgeCountAsync(0);
};
