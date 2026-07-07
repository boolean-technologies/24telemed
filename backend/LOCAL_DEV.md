# Local backend for mobile development

`docker-compose.override.yml` runs an **isolated Postgres + Redis** and points the
backend at them, so nothing here touches the production database or the CapRover
Redis. The override is auto-merged by `docker compose up`.

## 1. Start the stack

```bash
cd backend
docker compose up --build
```

This brings up `db` (Postgres), `redis`, and `backend` (Daphne on :8000). The
entrypoint runs `migrate` against the **local** database on every start, so the
schema — including the new `booking` app — is created automatically.

> Production-style run (uses server/.env's real DATABASE_URL/Redis) is still
> available with: `docker compose -f docker-compose.yml up`

> **If you already started the stack once** (before the `trust` auth fix), the
> Postgres volume was initialized with SCRAM. Recreate it:
> ```bash
> docker compose down -v && docker compose up --build
> ```

## 2. Seed test accounts

```bash
docker compose exec backend python manage.py seed_dev
```

Creates:

| Role      | Username    | Password      |
|-----------|-------------|---------------|
| Doctor    | `doctor`    | `password123` |
| Personnel | `personnel` | `password123` |

…plus a sample patient (John Doe, phone `08000000000`). Create more via the admin
at http://localhost:8000/admin/ (`createsuperuser` first if needed).

## 3. Point the mobile app at it

A phone/emulator can't reach `localhost`, so use your machine's LAN IP. In
`mobile/.env` (see the commented "LOCAL DEV" block):

```
EXPO_PUBLIC_API_BASE_URL=http://<LAN_IP>:8000
EXPO_PUBLIC_WEBSOCKET_BASE=ws://<LAN_IP>:8000/video_call/
EXPO_PUBLIC_WS_ORIGIN=http://localhost
```

`EXPO_PUBLIC_WS_ORIGIN=http://localhost` matters: React Native doesn't send an
Origin header, and the Channels `OriginValidator` only accepts origins in
`ALLOWED_ORIGINS`. The override lists `http://localhost`, so the call WebSocket
connects. Find your LAN IP with `ipconfig getifaddr en0` (macOS).

## What works locally

- ✅ Auth, patient search, call history, bookings (full REST).
- ✅ Live call **signalling** (ring / answer / decline) over the local Redis.
- ⚠️ The in-call **video** screen loads the *deployed* web meeting page in a
  WebView, which talks to **production**. A call created on the local backend
  won't be found there. To test video end-to-end locally you'd also run the web
  apps (`nx serve doctor-app` / `personnel-app`) against this backend and set
  `EXPO_PUBLIC_PERSONNEL_WEB_URL` / `EXPO_PUBLIC_DOCTOR_WEB_URL` to those local URLs.

## Reset the database

```bash
docker compose down -v   # removes the telemed_pgdata volume
```
