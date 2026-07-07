/**
 * Central, typed access to the app's public configuration.
 *
 * Expo only exposes env vars prefixed with `EXPO_PUBLIC_` to the JS bundle, and
 * they are inlined at build time — so ONLY put client-safe values here. Never
 * reference backend secrets (DB URL, AWS keys, SendGrid, Paystack *secret*).
 *
 * Mirrors the web apps' env contract:
 *   VITE_API_BASE            -> EXPO_PUBLIC_API_BASE_URL
 *   VITE_WEBSOCKET_BASE      -> EXPO_PUBLIC_WEBSOCKET_BASE
 *   VITE_VIDEO_SDK_TOKEN     -> EXPO_PUBLIC_VIDEO_SDK_TOKEN
 *   VITE_PAYSTACK_PUBLIC_KEY -> EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY
 *   VITE_ADMIN_CONTACT_*     -> EXPO_PUBLIC_ADMIN_CONTACT_*
 */

function required(value: string | undefined, name: string, fallback: string) {
  if (value && value.length > 0) return value;
  if (__DEV__) {
    console.warn(`[env] ${name} is not set; falling back to "${fallback}".`);
  }
  return fallback;
}

export const env = {
  /** Django REST API base URL. */
  apiBaseUrl: required(
    process.env.EXPO_PUBLIC_API_BASE_URL,
    'EXPO_PUBLIC_API_BASE_URL',
    'http://localhost:8000'
  ),

  /** WebSocket URL for live call signalling (wss://host/video_call/). */
  websocketBase:
    process.env.EXPO_PUBLIC_WEBSOCKET_BASE ?? 'ws://localhost:8000/video_call/',

  /**
   * Origin header sent on the call WebSocket. The backend's Channels
   * OriginValidator only accepts origins listed in ALLOWED_ORIGINS, and React
   * Native doesn't set an Origin automatically — so we send one explicitly.
   * Defaults to the API base (which is in the production ALLOWED_ORIGINS); for a
   * local backend set EXPO_PUBLIC_WS_ORIGIN=http://localhost.
   */
  wsOrigin:
    process.env.EXPO_PUBLIC_WS_ORIGIN ??
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    'http://localhost',

  /** videosdk.live static client token, used to join video calls. */
  videoSdkToken: process.env.EXPO_PUBLIC_VIDEO_SDK_TOKEN ?? '',

  /**
   * Deployed web apps. The in-call screen loads the existing responsive web
   * meeting page (`/meeting/:callLogId`) inside a WebView, reusing all the web
   * video logic. One per role since they're separate deployments.
   */
  personnelWebUrl:
    process.env.EXPO_PUBLIC_PERSONNEL_WEB_URL ??
    'https://personnel-connect.24telemed.org',
  doctorWebUrl:
    process.env.EXPO_PUBLIC_DOCTOR_WEB_URL ??
    'https://doctor-connect.24telemed.org',

  /** Paystack PUBLIC key (pk_...) for in-app wallet funding. */
  paystackPublicKey: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY ?? '',

  /** Support contact shown on the login / help screens. */
  adminContactEmail:
    process.env.EXPO_PUBLIC_ADMIN_CONTACT_EMAIL ?? 'info@24telemed.org',
  adminContactPhone:
    process.env.EXPO_PUBLIC_ADMIN_CONTACT_PHONE ?? '+2348130790883',
} as const;
