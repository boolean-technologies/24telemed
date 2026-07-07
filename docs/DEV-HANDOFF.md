# 24Telemed Mobile — Developer Handoff

Hand this to another developer as context. It describes a telemedicine **mobile app**
(Expo/React Native) added to an existing repo, the **backend changes** made for it,
how to run everything locally, test accounts, and what's left.

---

## 1. What this project is

A cross-platform (iOS/Android) **telemedicine mobile app** living in `mobile/`, added to an
existing monorepo. It serves **two roles in one app**: **Patient** (self-service) and **Doctor**.
Patients sign up, fill medical records, then **call an online doctor** or **book an appointment**;
doctors get the call (ring → answer) and run a **native video consultation**. It reuses the
existing Django backend (auth, call logic, VideoSDK rooms, wallet, patients).

> Originally the app had **Doctor + Personnel (assistant)** roles; the client then pivoted to
> **Patient + Doctor** (patients self-serve instead of an assistant). The mobile "personnel" UI
> was removed; the backend `personnel`/`customer` machinery is reused (a Patient == backend
> `customer` user; they are the "caller" in the existing call flow).

## 2. Repo layout

```
backend/    Django REST API (SHARED — used by web + mobile). Changes here must stay backward-compatible.
frontend/   Nx workspace with the existing WEB apps (doctor-app, personnel-app). ⚠️ DO NOT MODIFY web app code — client requirement.
mobile/     The NEW Expo app (this project's focus).
docs/       Scope PDF + this handoff.
```

## 3. Mobile tech stack

- **Expo SDK 54**, React Native 0.81, React 19, **Expo Router 6** (file-based routing), TypeScript (strict).
- **@tanstack/react-query** for data; **expo-secure-store** for JWT.
- **Native video**: `@videosdk.live/react-native-sdk` + `react-native-webrtc` (+ `react-native-incall-manager`, `@config-plugins/react-native-webrtc`). **Requires a dev build — NOT Expo Go.**
- `expo-linear-gradient`, `@expo/vector-icons`, `expo-splash-screen`, `expo-dev-client`.
- `.npmrc` has `legacy-peer-deps=true` (needed for Expo + npm peer resolution).
- **API client**: the backend's generated OpenAPI client is **vendored** at `mobile/src/api/`.
  Regenerate from `frontend/packages/api-generated` (or `<API>/?format=openapi`) if the backend contract changes.
  Endpoints added after vendoring are hand-written (see `mobile/src/auth/registerApi.ts`, `mobile/src/features/booking/api.ts`).

## 4. Mobile structure (key paths)

```
mobile/app/
  _layout.tsx            providers (React Query, Auth) + API config + VideoSDK register (guarded) + animated splash
  index.tsx              auth gate → redirects by role
  (auth)/login.tsx       Patient/Doctor toggle + "Create account"
  (auth)/signup.tsx      patient/doctor self sign-up + Terms/Privacy acceptance
  (patient)/             Patient area: tabs, bookings/new, chat/[id], consultation/[id], meeting/[id]
  (doctor)/              Doctor area: tabs, chat/[id], consultation/[id], profile-edit, meeting/[id]
  legal/[doc].tsx        Terms / Privacy screens (placeholder text)
  change-password.tsx
mobile/src/
  api/                   vendored OpenAPI client
  auth/                  AuthContext (signIn/signUp/signOut), storage (Role = 'patient'|'doctor'), registerApi
  realtime/              WebSocket call signalling (ported from web): useCallSocket, PersonnelCallProvider (= caller/patient), DoctorCallProvider, messages
  features/
    meeting/             NativeMeeting (VideoSDK) + MeetingHost (lazy-loads it, shows fallback if no WebRTC)
    personnel/           CallDoctorSheet, CallingOverlay  (the "caller" = patient; name kept to limit churn)
    doctor/              IncomingCallOverlay
    booking/             api/hooks/screens (Personnel* = patient/caller bookings, Doctor* = doctor bookings)
    chat/                persistent conversation list/thread UI + unread counts
    consultation/        doctor notes/prescriptions + patient/doctor consultation summary
    patient/             PatientRecordsForm (full medical record)
    legal/               Terms/Privacy placeholder text (REPLACE)
  hooks/                 usePatients, useCallLogs, useDoctors (+ useOnlineDoctors), useCallLog
  components/ui/         Button, Avatar, Card, TextField, StatusBadge, KeyboardDoneBar (iOS "Done" bar)
  config/                env.ts (typed EXPO_PUBLIC_* config), api.ts (OpenAPI base + token + WS origin)
```

## 5. Backend changes made (all ADDITIVE, web untouched)

In `backend/server/`:
- **`POST /auth/register/`** (`users/views.py:RegisterView`, `RegistrationSerializer`) — public self sign-up for
  `customer` (patient, active) and `doctor` (**`is_verified=False`** until admin approval). Returns JWT tokens.
- **`User.is_verified`** field (`users/models.py`) + migration `users/migrations/0020_user_is_verified.py`
  (default `True`, so existing users unaffected). Admin (`users/admin.py`) shows/edits it (list_editable).
  `DoctorUserViewSet` filters `is_verified=True` so unapproved doctors are hidden from patients.
- **Router order fix** in `users/urls.py` (register `doctors`/`personnels` before the empty `''` prefix, else
  `/users/doctors/` 404s) — and `DoctorUserViewSet` now filters `user_type='doctor'`.
- **Booking app** (`backend/server/booking/`) — `Booking` model, serializers, `/bookings/personnel/` and
  `/bookings/doctor/` viewsets (create/list/cancel/confirm/decline/start). Migration `0001_initial.py`.
  `start()` creates a `CallLog` + VideoSDK room. **Booking list endpoints are paginated** (`{results: []}`).
- **Patient profile auto-links to its user** (`patient/views.py perform_create`) for `customer` users.
- **Profile photo upload** (`POST /users/profile_photo/`) stores an uploaded image through the existing
  `File` model and assigns it to the authenticated user.
- **Mobile-safe password reset** keeps OTP state server-side (`PasswordResetRequest`) instead of relying
  on cookies: request OTP → verify with `reset_id` → change with a single-use `reset_token`.
- **Push notifications** (`PushDevice`, `/users/push_devices/`) use Expo Push Service for incoming calls,
  booking requests/status updates, and appointment reminders. Incoming calls still use the WebSocket while
  foregrounded; a recently initiated call is restored when a doctor opens the app from a push.
- **Persistent chat** (`backend/server/chat/`) creates one conversation per doctor/patient relationship.
  `/chat/conversations/` lists/creates threads and `/chat/conversations/{id}/messages/` reads/sends messages.
  Creating a thread is allowed only after a booking or call relationship; new messages send an Expo push.
  Messages support swipe-to-reply, one reaction per user, and up to five 10 MB attachments. Attachment
  metadata is stored in PostgreSQL and file bytes use the configured Django/S3 storage. Apply migrations
  `chat/0001_initial.py` and `chat/0002_message_replies_reactions_attachments.py`.
- **Consultation records** reuse `MedicalEncounter` and `PrescribedDrug`. Doctors can update encounter notes
  and prescribe through `/doctors/medical-encounters/doctor-medical-encounters/{id}/prescribe/`; patients can
  only read their own encounters. Prescriptions now include duration/instructions and trigger a patient push.
  Completed calls complete their related booking. Apply migration `medication/0003_...`.

Login: patients (customer) authenticate via `/auth/token/personnel/` (its serializer accepts `customer`);
doctors via `/auth/token/doctor/`.

## 6. Running locally

### Backend (Docker — local Postgres + Redis, isolated from prod)
`backend/docker-compose.override.yml` provides local Postgres (auth=`trust` to avoid a libpq/SCRAM issue) +
Redis, **bind-mounts the code and runs `runserver`** (hot reload + websockets), and sets `ALLOWED_ORIGINS`
to include localhost + the dev LAN IP + web ports 4200/4300.

```bash
cd backend
docker compose up -d
docker compose exec backend python manage.py migrate          # applies booking + is_verified
docker compose exec backend python manage.py seed_dev         # test accounts (below)
```
> CapRover (prod) uses `docker-compose.yml`/Dockerfile directly; the override is local-only.

### Mobile
```bash
cd mobile
npm install
# Set mobile/.env (see EXPO_PUBLIC_* below). Use your machine's LAN IP, not localhost.
# Build a dev client (native video needs it):
eas build --profile development --platform ios     # or: npx expo run:ios --device
npx expo start --dev-client
```

### Web apps (only if testing the doctor side on web)
`frontend/.env` was pointed at the local backend (LAN IP) for testing. Serve with `--host 0.0.0.0`:
```bash
cd frontend && npx nx serve doctor-app --host 0.0.0.0 --port 4200
```

### Env vars (`mobile/.env`, all `EXPO_PUBLIC_*`, inlined at build — restart Expo with `-c` after changes)
```
EXPO_PUBLIC_API_BASE_URL=http://<LAN_IP>:8000
EXPO_PUBLIC_WEBSOCKET_BASE=ws://<LAN_IP>:8000/video_call/     # Channels consumer is at /video_call/
EXPO_PUBLIC_WS_ORIGIN=http://localhost                       # RN sends no Origin; backend OriginValidator needs one in ALLOWED_ORIGINS
EXPO_PUBLIC_VIDEO_SDK_TOKEN=<videosdk token>
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=                             # for future wallet UI
```
`<LAN_IP>` was `192.168.100.10` during dev — replace with the current machine IP (`ipconfig getifaddr en0`).

Push notifications use the EAS project id already present in `mobile/app.json`. Configure APNs/FCM
credentials for the EAS project, then rebuild the development client after installing/configuring
`expo-notifications`. Optionally set `EXPO_PUSH_ACCESS_TOKEN` on the **backend** if enhanced Expo push
security is enabled.

Run appointment reminders every five minutes using the production platform's cron/scheduler:
```bash
python manage.py send_booking_reminders --minutes 30
```

## 7. Test accounts (password `password123`)

| Login as | Username | Notes |
|---|---|---|
| Patient | `patient` | Has a linked medical record → can call/book immediately |
| Doctor (approved) | `doctor` | Visible to patients, can take calls |
| Doctor (pending) | `doctor_pending` | Shows "awaiting approval"; approve in `/admin` (tick `is_verified`) |

## 8. How the call flow works

Both sides hold a WebSocket to `…/video_call/?userId=&type=&token=`. Patient (type `health-care-assistant`)
rings a doctor → backend creates a `CallLog` + VideoSDK room, rings the doctor (`INCOMING`) → doctor answers →
both navigate to `meeting/[callLogId]`, fetch `meeting_id`, and **join the same VideoSDK room natively**.
`END_CALL` over the socket marks the call `Completed`. Available-doctors presence is pushed over the socket;
the call sheet resolves online doctor **ids** to profiles via `/users/doctors/{id}/`.

## 9. Important gotchas

- **Native video ⇒ dev build only.** In Expo Go, WebRTC native module is absent; the app is built to **degrade
  gracefully** (`_layout` guards `register()` behind `NativeModules.WebRTCModule`; `MeetingHost` lazy-loads the
  meeting and shows a "needs dev build" fallback). Everything except joining a call works in Expo Go.
- **Run mobile commands from `mobile/`**, never `frontend/` (the Nx workspace has an old Expo 49 app → "SDK 49" error).
- **VideoSDK webhook** (`VIDEO_SDK_CALL_WEBHOOK`) points at prod and can't reach a local backend, so call
  duration/auto-close won't update locally — status still completes via the `END_CALL` socket message.
- **Booking list endpoints are paginated** — normalize `{results: []}` (handled in `mobile/src/features/booking/api.ts`).
- **Terms/Privacy text is placeholder** (`mobile/src/features/legal/content.ts`) — awaiting final copy.
- **Remote push requires a physical dev/production build and APNs/FCM credentials.** It does not work in
  Expo Go on Android. A normal push can alert and open the app, but it is not an iOS CallKit/VoIP push.
- **Booking reminders require scheduling** the `send_booking_reminders` management command (recommended:
  every five minutes).
- **Chat uses short polling** (10 seconds for the inbox, 5 seconds in an open thread), backed by persistent
  Django records. Push notifications cover background/closed-app delivery; chat is not currently WebSocket-live.
- **Do not modify the web apps** under `frontend/apps/*` (client requirement). Backend changes must stay additive.

## 10. Built vs. optional (see `docs/24Telemed-Mobile-Scope.pdf` for the full scope)

**Built:** patient/doctor self sign-up + login and forgot-password OTP (+Terms/Privacy), profile photo upload,
patient medical records (all fields), call-a-doctor (native video), book/manage appointments, doctor
dashboard/incoming-call/profile, persistent doctor/patient chat with push notifications, doctor encounter
notes and prescriptions during calls, chat replies/reactions/file attachments, patient/doctor
completed-consultation details, change password,
animated splash, doctor admin-approval gate, push notifications for incoming calls, messages,
prescriptions, and booking lifecycle/reminders.

**Optional / not yet:** wallet top-up & payments UI (Paystack — backend exists, needs public key + UI),
CallKit/Android full-screen VoIP calling, record photo upload, doctor ratings, real-time WebSocket chat,
typing indicators and attachment virus scanning, genotype/extended record fields, a native date
picker for DOB (currently `YYYY-MM-DD` text), multi-language.

## 11. Verify quickly

```bash
cd mobile && npx tsc --noEmit
npx expo export --platform android
```
```bash
cd backend
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py test chat medication users --noinput
```
```
