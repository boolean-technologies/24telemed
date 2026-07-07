import { OpenAPI } from '../api';
import { getAccessToken } from '../auth/storage';
import { env } from './env';

/** Base URL of the Django backend (see src/config/env.ts and .env.example). */
export const API_BASE_URL = env.apiBaseUrl;

/**
 * Wire the generated OpenAPI client to the backend and have every request
 * resolve the current JWT access token from secure storage. Call once at
 * app startup (see app/_layout.tsx).
 */
export function configureApiClient() {
  OpenAPI.BASE = API_BASE_URL;
  // RN has no cookies; rely purely on the bearer token.
  OpenAPI.WITH_CREDENTIALS = false;
  OpenAPI.CREDENTIALS = 'omit';
  OpenAPI.TOKEN = async () => (await getAccessToken()) ?? '';
}
