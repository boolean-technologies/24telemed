import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Token persistence. Uses expo-secure-store on native; falls back to
 * localStorage on web (where SecureStore is unavailable).
 */

export type Role = 'doctor' | 'patient';

const ACCESS_KEY = 'telemed.access';
const REFRESH_KEY = 'telemed.refresh';
const ROLE_KEY = 'telemed.role';

const isWeb = Platform.OS === 'web';

async function setItem(key: string, value: string) {
  if (isWeb) {
    globalThis.localStorage?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    return globalThis.localStorage?.getItem(key) ?? null;
  }
  return SecureStore.getItemAsync(key);
}

async function removeItem(key: string) {
  if (isWeb) {
    globalThis.localStorage?.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export type StoredSession = {
  access: string;
  refresh: string;
  role: Role;
};

export async function saveSession(session: StoredSession) {
  await Promise.all([
    setItem(ACCESS_KEY, session.access),
    setItem(REFRESH_KEY, session.refresh),
    setItem(ROLE_KEY, session.role),
  ]);
}

export async function loadSession(): Promise<StoredSession | null> {
  const [access, refresh, role] = await Promise.all([
    getItem(ACCESS_KEY),
    getItem(REFRESH_KEY),
    getItem(ROLE_KEY),
  ]);
  if (!access || !refresh || !role) return null;
  return { access, refresh, role: role as Role };
}

export async function clearSession() {
  await Promise.all([
    removeItem(ACCESS_KEY),
    removeItem(REFRESH_KEY),
    removeItem(ROLE_KEY),
  ]);
}

export async function getAccessToken(): Promise<string | null> {
  return getItem(ACCESS_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return getItem(REFRESH_KEY);
}
