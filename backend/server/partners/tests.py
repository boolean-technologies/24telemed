import hashlib
import hmac
import json
from decimal import Decimal
from unittest.mock import patch

from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from call_log.call_log_manager import CallLogManager
from call_log.models import CallLog
from patient.models import Patient
from users.models import User
from wallet.models import Transaction
from . import services
from .models import ConsultationStatus, Partner, PartnerService

SECRET = 'sk_test_partner'


def signed_webhook(client, payload):
    body = json.dumps(payload).encode()
    signature = hmac.new(SECRET.encode(), body, hashlib.sha512).hexdigest()
    return client.post(
        '/wallet/webhook/paystack/', body, content_type='application/json',
        HTTP_X_PAYSTACK_SIGNATURE=signature,
    )


@override_settings(PAYSTACK_SECRET_KEY=SECRET, PARTNER_PORTAL_URL='https://portal.example')
class PartnerFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.partner = Partner.objects.create(
            name='Uriel I-Care Hospital', slug='uriel-icare', paystack_subaccount_code='ACCT_uriel',
        )
        self.doctor = User.objects.create_user(username='dr_briggs', password='x', user_type='doctor')
        self.other_doctor = User.objects.create_user(username='dr_general', password='x', user_type='doctor')
        self.service = PartnerService.objects.create(partner=self.partner, name='Sexual health', fee=Decimal('200000'))
        self.service.doctors.add(self.doctor)

    def register(self, username='ada', phone='08011111111'):
        return self.client.post('/partners/uriel-icare/register/', {
            'username': username, 'password': 'secret123', 'first_name': 'Ada', 'last_name': 'Obi',
            'email': f'{username}@example.com', 'phone_number': phone,
            'date_of_birth': '1990-05-01', 'gender': 'Female',
        }, format='json')

    def paid_consultation(self, user):
        consultation = services.create_consultation(user, self.service, patient=user.patient_profile.first())
        consultation.status = ConsultationStatus.PAID
        consultation.save()
        return consultation

    def test_public_partner_page_lists_services_and_doctors(self):
        response = self.client.get('/partners/uriel-icare/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['services'][0]['fee'], '200000.00')
        self.assertEqual(response.data['services'][0]['doctors'][0]['id'], str(self.doctor.id))

    def test_registration_tags_patient_with_partner(self):
        response = self.register()
        self.assertEqual(response.status_code, 201, response.data)
        user = User.objects.get(username='ada')
        self.assertEqual(user.user_type, 'customer')
        self.assertEqual(user.partner_membership.partner, self.partner)
        self.assertTrue(Patient.objects.filter(user=user, phone_number='08011111111').exists())

    @patch('partners.paystack.initialize_transaction', return_value={'authorization_url': 'https://checkout/x'})
    def test_checkout_splits_commission_to_main_account(self, initialize):
        self.register()
        user = User.objects.get(username='ada')
        self.client.force_authenticate(user)

        response = self.client.post('/partners/consultations/', {'service': str(self.service.id)}, format='json')

        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data['authorization_url'], 'https://checkout/x')
        payload = initialize.call_args[0][0]
        self.assertEqual(payload['amount'], 20_000_000)  # kobo
        self.assertEqual(payload['subaccount'], 'ACCT_uriel')
        self.assertEqual(payload['transaction_charge'], 3_000_000)  # 15%
        self.assertEqual(payload['bearer'], 'subaccount')
        self.assertEqual(payload['callback_url'], 'https://portal.example/app/payment/callback')
        self.assertEqual(payload['metadata']['kind'], 'partner_consultation')

    @patch('partners.paystack.initialize_transaction', return_value={'authorization_url': 'https://checkout/x'})
    def test_commission_is_configurable(self, initialize):
        self.partner.commission_percent = Decimal('20')
        self.partner.save()
        self.register()
        self.client.force_authenticate(User.objects.get(username='ada'))
        self.client.post('/partners/consultations/', {'service': str(self.service.id)}, format='json')
        self.assertEqual(initialize.call_args[0][0]['transaction_charge'], 4_000_000)

    def test_non_partner_patient_cannot_book_partner_service(self):
        outsider = User.objects.create_user(username='walkin', password='x', user_type='customer')
        self.client.force_authenticate(outsider)
        response = self.client.post('/partners/consultations/', {'service': str(self.service.id)}, format='json')
        self.assertEqual(response.status_code, 403)

    def test_webhook_marks_consultation_paid_without_crediting_wallet(self):
        self.register()
        user = User.objects.get(username='ada')
        consultation = services.create_consultation(user, self.service)

        response = signed_webhook(self.client, {'event': 'charge.success', 'data': {
            'reference': consultation.reference, 'amount': 20_000_000, 'currency': 'NGN', 'status': 'success',
            'customer': {'email': user.email},
            'metadata': {'kind': 'partner_consultation', 'consultation_id': str(consultation.id)},
        }})

        self.assertEqual(response.status_code, 200)
        consultation.refresh_from_db()
        self.assertEqual(consultation.status, ConsultationStatus.PAID)
        self.assertFalse(Transaction.objects.filter(wallet__user=user).exists())
        user.wallet.refresh_from_db()
        self.assertEqual(user.wallet.balance, 0)

    def test_underpayment_is_not_accepted(self):
        self.register()
        consultation = services.create_consultation(User.objects.get(username='ada'), self.service)
        services.apply_successful_charge({
            'reference': consultation.reference, 'amount': 100, 'currency': 'NGN', 'status': 'success',
            'metadata': {'kind': 'partner_consultation', 'consultation_id': str(consultation.id)},
        })
        consultation.refresh_from_db()
        self.assertEqual(consultation.status, ConsultationStatus.PENDING_PAYMENT)

    def test_call_rules(self):
        self.register()
        user = User.objects.get(username='ada')
        unpaid = services.create_consultation(user, self.service)
        with self.assertRaises(services.PartnerCallError):
            services.check_call_allowed(user.id, self.doctor.id, unpaid.id)

        paid = self.paid_consultation(user)
        self.assertEqual(services.check_call_allowed(user.id, self.doctor.id, paid.id), paid)
        with self.assertRaises(services.PartnerCallError):
            services.check_call_allowed(user.id, self.other_doctor.id, paid.id)
        # Someone else's consultation can't be used.
        with self.assertRaises(services.PartnerCallError):
            services.check_call_allowed(self.other_doctor.id, self.doctor.id, paid.id)
        # Exclusive doctors can't be reached by a regular wallet call.
        with self.assertRaises(services.PartnerCallError):
            services.check_call_allowed(user.id, self.doctor.id)
        self.assertIsNone(services.check_call_allowed(user.id, self.other_doctor.id))

    def test_completed_partner_call_is_not_billed_to_wallet(self):
        self.register()
        user = User.objects.get(username='ada')
        consultation = self.paid_consultation(user)
        call = CallLog.objects.create(
            doctor=self.doctor, health_care_assistant=user,
            patient=user.patient_profile.first(), partner_consultation=consultation,
        )
        now = timezone.now()
        call.sessionEnded(now - timezone.timedelta(minutes=20), now)

        consultation.refresh_from_db()
        self.assertEqual(consultation.status, ConsultationStatus.COMPLETED)
        self.assertFalse(Transaction.objects.filter(wallet__user=user).exists())

    def test_partner_call_message_is_json_serializable(self):
        # The incoming-call socket message carries the call log as JSON.
        self.register()
        user = User.objects.get(username='ada')
        call = CallLog.objects.create(
            doctor=self.doctor, health_care_assistant=user, partner_consultation=self.paid_consultation(user),
        )
        manager = CallLogManager()
        manager.setCallLog(call)
        json.dumps(manager.composeMessage('NOTIFY_DOCTOR_CLIENT_INCOMING_CALL'))

    def test_exclusive_doctors_hidden_from_other_patients(self):
        self.register()
        member = User.objects.get(username='ada')
        outsider = User.objects.create_user(username='walkin', password='x', user_type='customer')
        online = [str(self.doctor.id), str(self.other_doctor.id)]

        visible = services.visible_doctors_by_caller(online, [str(member.id), str(outsider.id), 'not-a-uuid'])

        self.assertEqual(visible[str(member.id)], online)
        self.assertEqual(visible[str(outsider.id)], [str(self.other_doctor.id)])
        self.assertEqual(visible['not-a-uuid'], [str(self.other_doctor.id)])

        self.client.force_authenticate(outsider)
        listed = [d['id'] for d in self.client.get('/users/doctors/').data['results']]
        self.assertNotIn(str(self.doctor.id), listed)
        self.assertIn(str(self.other_doctor.id), listed)

    def test_exclusive_doctor_cannot_be_booked_with_wallet(self):
        outsider = User.objects.create_user(username='walkin', password='x', user_type='customer')
        outsider.wallet.balance = 10_000
        outsider.wallet.save()
        self.client.force_authenticate(outsider)
        response = self.client.post('/bookings/personnel/', {
            'doctor': str(self.doctor.id), 'scheduled_time': '2030-01-01T10:00:00Z',
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('doctor', response.data)
