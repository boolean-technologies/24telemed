# 24Telemed Mobile

Cross-platform (iOS / Android) mobile app for the 24Telemed TeleHealth Connect
platform. Built with **Expo + Expo Router + TypeScript**. It talks to the
existing Django backend and ships **both** the doctor and personnel experiences
in a single app, gated by role at login.

## How it fits the repo

- **Backend**: reused as-is (`../backend`). Auth via SimpleJWT:
  - `POST /auth/token/doctor/`
  - `POST /auth/token/personnel/`
  - `POST /auth/token/refresh/`
- **API client**: the generated OpenAPI client from
  `../frontend/packages/api-generated` is vendored into `src/api/` so the app
  uses the exact same typed backend contract as the web apps. To refresh it
  after backend changes, re-run the web workspace's `yarn generate` and copy the
  output, or regenerate against `<API>/?format=openapi`.

## Architecture

```
app/                          Expo Router routes (file-based)
  _layout.tsx                 Providers (React Query, Auth) + API config
  index.tsx                   Auth gate → redirects by role
  (auth)/login.tsx            Doctor / Personnel login (role toggle)
  (personnel)/
    _layout.tsx               PersonnelCallProvider + CallingOverlay
    (tabs)/                   Search · History · Bookings · Profile
    patient/[id].tsx          Patient profile + "Call a doctor" / "Schedule"
    bookings/new.tsx          Create a booking (doctor, day, time, priority)
    meeting/[id].tsx          In-call WebView
  (doctor)/
    _layout.tsx               DoctorCallProvider + IncomingCallOverlay
    (tabs)/                   Home(stats) · History · Bookings · Profile
    meeting/[id].tsx          In-call WebView
src/
  api/                        Vendored generated OpenAPI client
  auth/                       AuthContext + secure token storage
  realtime/                   WebSocket call signalling (ported from web)
  hooks/                      React Query data hooks
  features/
    shared/                   MeetingWebView, CallHistoryList
    personnel/                CallingOverlay, CallDoctorSheet
    doctor/                   IncomingCallOverlay
    booking/                  Booking API + hooks + screens
  components/ui/              Button, Card, Avatar, TextField, StatusBadge
  config/                     env.ts (typed config) + api.ts (client wiring)
  query/  theme/
```

### Live call flow (reuses the existing backend)
1. Each role opens a reconnecting WebSocket to `…/video_call/` (`src/realtime`).
2. Personnel searches a patient → picks an **online** doctor → rings them.
3. The doctor gets a full-screen **incoming call** overlay → answers.
4. Both navigate to `meeting/[callLogId]`. The in-call screen joins the VideoSDK
   room **natively** via `@videosdk.live/react-native-sdk` + `react-native-webrtc`
   (`src/features/meeting/NativeMeeting.tsx`) using the `meeting_id` the backend
   created. The doctor's web app joins the same room, so both sides connect.

> The native video stack uses WebRTC, so the app must run as a **development
> build** (not Expo Go). See "Development build" below.

### Booking / scheduling (new)
Personnel schedule a future consultation with a doctor; the doctor confirms or
declines; at the time either side taps **Start call**, which creates a CallLog +
VideoSDK room server-side and opens the same native meeting. Backend lives in
`backend/server/booking/` (`/bookings/personnel/`, `/bookings/doctor/`).

- JWT access/refresh tokens are stored in `expo-secure-store` (native) /
  `localStorage` (web). The signed-in role is persisted and drives navigation.

## Getting started

```bash
cd mobile
npm install
cp .env.example .env      # set EXPO_PUBLIC_API_BASE_URL to your backend
npm start                 # then press i / a, or scan the QR with Expo Go
```

> **Local backend tip:** a phone or emulator cannot reach `localhost`. Set
> `EXPO_PUBLIC_API_BASE_URL` to your machine's LAN IP, e.g.
> `http://192.168.1.20:8000`, and run the backend with
> `python manage.py runserver 0.0.0.0:8000`.

## Development build (required for the video call)

The in-call screen uses native WebRTC (`react-native-webrtc` via VideoSDK), which
is **not** included in Expo Go. Everything else (auth, search, booking, ringing)
works in Expo Go, but to join a call you need a dev build:

**Option A — local (Mac + Xcode):**
```bash
npx expo run:ios            # simulator (no camera — connects, but no local video)
npx expo run:ios --device   # physical iPhone (real camera/mic; needs signing)
```

**Option B — EAS cloud build (easiest for a physical device):**
```bash
npm i -g eas-cli
eas login
eas build --profile development --platform ios   # then install via the QR/link
npx expo start --dev-client                       # connect the dev build to Metro
```
(`development-simulator` profile builds for the iOS Simulator.)

Camera/mic permissions and the WebRTC build settings are handled by the
`@config-plugins/react-native-webrtc` plugin + `app.json` `infoPlist`. The
VideoSDK token comes from `EXPO_PUBLIC_VIDEO_SDK_TOKEN`.

## Backend note (booking feature)

The booking feature adds a new Django app at `backend/server/booking/`. It's
registered in `INSTALLED_APPS` and `server/urls.py`, with a hand-written
migration at `booking/migrations/0001_initial.py`. Before the booking endpoints
work you must apply it against your database:

```bash
cd backend/server
python manage.py migrate booking
```

(The migration was authored but **not** run here, since the configured database
is the live production instance.)

## Status

Implemented: role-based auth, personnel patient-search → call-a-doctor, doctor
incoming-call/answer, **native VideoSDK in-call**, call history + stats, and the
full booking flow (create / confirm / decline / start) on both sides. `tsc` passes
clean. Remaining polish: push notifications for incoming calls when backgrounded,
patient registration, and wallet/top-up screens.
