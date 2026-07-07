import { Platform } from 'react-native';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/auth/storage';

async function deviceRequest(token: string, method: 'POST' | 'DELETE') {
  const accessToken = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/users/push_devices/`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ token, platform: Platform.OS }),
  });
  if (!response.ok && response.status !== 204) {
    throw new Error('Could not update this device notification settings.');
  }
}

export function registerPushDevice(token: string) {
  return deviceRequest(token, 'POST');
}

export function unregisterPushDevice(token: string) {
  return deviceRequest(token, 'DELETE');
}
