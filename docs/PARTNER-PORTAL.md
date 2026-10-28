# Partner clinics: portal + Paystack split payments

Lets a partner clinic (first one: **Uriel I-Care Hospital**) offer its own paid
services through 24Telemed. Its patients sign up on the clinic's page, pay the
consultation fee, then video-call the clinic's doctors. Paystack splits each
payment: **24Telemed keeps the commission** (default 15%, editable per partner),
and the rest settles to the clinic's bank account.

## Pieces

| Part | Where |
|---|---|
| Backend app | `backend/server/partners/` (models, Paystack client, API, admin) |
| Patient web portal | `frontend/apps/partner-portal/` (new app; existing web apps untouched) |
| Doctors | Same doctor apps as today. They're normal doctor accounts assigned to a service |

**How a patient is "from" a partner:** signing up at `https://<portal>/<partner-slug>/signup`
creates a `customer` user plus a `PartnerMembership` row. The membership links that
patient to the partner. Each partner gets its own slug, so you can add more partners later.

**Payments:** a consultation is paid up front, per service. It does not use the
wallet. Checkout is started server-side, so the amount can't be changed in the browser.
Each checkout sends Paystack these fields:
- `subaccount`: the partner's subaccount
- `transaction_charge`: our commission
- `bearer`: who pays the Paystack fee (partner by default)

The existing Paystack webhook (`/wallet/webhook/paystack/`) sees `metadata.kind =
partner_consultation`. It then marks that consultation paid and does **not** credit
the patient's wallet.

**Calls:** the patient calls a service doctor from the consultation page. The server
checks the call before the doctor's phone rings:
- the consultation is paid
- it belongs to the caller
- the doctor is on that service

A finished call marks the consultation `completed` and is not billed to the wallet.
Declined or missed calls don't use up the consultation.

**Exclusive doctors** (`Partner.exclusive_doctors`, on by default): a partner's doctors
are hidden from regular 24Telemed patients. They're removed from the online-doctors
list and the doctor browse list, and they can't be booked or called with a wallet.

## Going live

1. **Deploy the backend.** Then run migrations (`partners/0001`, `call_log/0014`) and
   `python manage.py seed_uriel_partner`. The seed creates the partner and its three services.
2. **Backend env:**
   - `PAYSTACK_SECRET_KEY`: already used by the wallet.
   - `PARTNER_PORTAL_URL`: the portal's public URL, `https://telemed-24-partners.thebooleantech.com.ng`.
     Paystack sends patients back here after payment.
   - Add the portal URL to `ALLOWED_ORIGINS`. Without it, the call WebSocket rejects the
     portal and doctors never appear as online.
3. **Paystack subaccount.** Go to Admin → Partner clinics → Uriel I-Care Hospital and set:
   - the settlement bank code (`232` = Sterling Bank)
   - the account number
   - the contact email/phone

   Then run the **"Create / sync Paystack subaccount"** action. Paystack checks the
   account, and its name comes back in *Settlement account name*. Check that it reads
   URIEL I-CARE HOSPITAL LTD.
   - If a service settles to a different account, create a second subaccount on the
     Paystack dashboard. Paste its `ACCT_…` code into that service's *Paystack subaccount
     code*.
   - Paystack subaccounts settle in **naira**. The clinic's note says Life is Sweet uses a
     domiciliary account. Confirm a naira account with the clinic, or with Paystack, before
     going live.
4. **Doctors.** Each doctor signs up in the doctor app as usual and is approved
   (`is_verified`). Then add them to the right service in the partner admin page.
5. **Build and deploy the portal.** It's a static SPA; deploy it like the other web apps:
   ```bash
   cd frontend
   VITE_API_BASE=https://<api> VITE_WEBSOCKET_BASE=wss://<api>/video_call/ \
   VITE_VIDEO_SDK_TOKEN=<token> npx nx build partner-portal   # → dist/apps/partner-portal
   ```
   Optional: `VITE_DEFAULT_PARTNER_SLUG=uriel-icare` makes the bare domain open
   Uriel's page.
6. **Share the link:** `https://<portal>/uriel-icare`.

Change the commission any time in the partner list (it's editable inline). New checkouts
use the new rate right away. Already-created consultations keep the rate they were
created with.

## Local run

```bash
cd frontend && VITE_API_BASE=http://<lan-ip>:8000 VITE_WEBSOCKET_BASE=ws://<lan-ip>:8000/video_call/ npm run start:partner   # :4400
```
Open `http://localhost:4400/uriel-icare`. With Paystack **test** keys you need a test
subaccount, which you can create with the same admin action.
