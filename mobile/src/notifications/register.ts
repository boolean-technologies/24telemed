import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { registerPushDevice, unregisterPushDevice } from './api';

const PUSH_TOKEN_KEY = 'telemed.expoPushToken';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const isIncomingCall =
      notification.request.content.data?.type === 'incoming_call';
    return {
      shouldPlaySound: true,
      shouldSetBadge: false,
      // The WebSocket already displays the ringing overlay in the foreground.
      shouldShowBanner: !isIncomingCall,
      shouldShowList: true,
    };
  },
});

async function createAndroidChannels() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('incoming-calls', {
    name: 'Incoming calls',
    description: 'Urgent incoming consultation alerts',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 250, 500],
    sound: 'default',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
  await Notifications.setNotificationChannelAsync('appointments', {
    name: 'Appointments',
    description: 'Booking updates and appointment reminders',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
  await Notifications.setNotificationChannelAsync('messages', {
    name: 'Messages',
    description: 'New private messages from your doctor or patient',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
}

export async function registerForPushNotifications() {
  if (Platform.OS === 'web' || !Device.isDevice) return null;

  await createAndroidChannels();
  const current = await Notifications.getPermissionsAsync();
  const permission =
    current.status === 'granted'
      ? current
      : await Notifications.requestPermissionsAsync();
  if (permission.status !== 'granted') return null;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;
  if (!projectId) throw new Error('EAS project ID is missing.');

  const token = (
    await Notifications.getExpoPushTokenAsync({ projectId })
  ).data;
  await registerPushDevice(token);
  await SecureStore.setItemAsync(PUSH_TOKEN_KEY, token);
  return token;
}

export async function unregisterForPushNotifications() {
  if (Platform.OS === 'web') return;
  const token = await SecureStore.getItemAsync(PUSH_TOKEN_KEY);
  if (!token) return;
  try {
    await unregisterPushDevice(token);
  } finally {
    await SecureStore.deleteItemAsync(PUSH_TOKEN_KEY);
  }
}
