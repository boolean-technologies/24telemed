import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter, type Href } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import { registerForPushNotifications } from './register';

export function NotificationManager() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const handledNotification = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    void registerForPushNotifications().catch((error) => {
      // Registration can legitimately fail while offline and is retried next launch.
      console.warn('Push notification registration failed:', error);
    });
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    function handleResponse(response: Notifications.NotificationResponse) {
      const identifier = response.notification.request.identifier;
      if (handledNotification.current === identifier) return;
      handledNotification.current = identifier;
      const route = response.notification.request.content.data?.route;
      if (typeof route === 'string' && route.startsWith('/')) {
        router.push(route as Href);
      }
    }

    const subscription =
      Notifications.addNotificationResponseReceivedListener(handleResponse);
    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) handleResponse(response);
    });
    return () => subscription.remove();
  }, [isAuthenticated, router]);

  return null;
}
