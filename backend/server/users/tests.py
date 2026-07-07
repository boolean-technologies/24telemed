from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIClient

from utils.push_notifications import send_push_to_user
from .models import PushDevice, User


class PasswordResetFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='reset_patient',
            email='patient@example.com',
            password='OldPassword!42',
            user_type='customer',
        )

    @patch('users.views.Notification.send', return_value=True)
    @patch('users.views.pyotp.TOTP.now', return_value='123456')
    def test_mobile_otp_can_change_password_once(self, _otp, _send):
        request = self.client.post(
            '/users/forget_password/',
            {'identifier': self.user.email},
            format='json',
        )
        self.assertEqual(request.status_code, 200)
        reset_id = request.data['reset_id']

        verify = self.client.post(
            '/users/otp_validation/',
            {'reset_id': reset_id, 'otp': '123456'},
            format='json',
        )
        self.assertEqual(verify.status_code, 200)

        change = self.client.put(
            '/users/password_reset_change/',
            {
                'reset_id': reset_id,
                'reset_token': verify.data['reset_token'],
                'new_password': 'NewPassword!84',
            },
            format='json',
        )
        self.assertEqual(change.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewPassword!84'))

        reused = self.client.put(
            '/users/password_reset_change/',
            {
                'reset_id': reset_id,
                'reset_token': verify.data['reset_token'],
                'new_password': 'AnotherPassword!21',
            },
            format='json',
        )
        self.assertEqual(reused.status_code, 400)

    @patch('users.views.Notification.send', return_value=True)
    @patch('users.views.pyotp.TOTP.now', return_value='123456')
    def test_invalid_otp_is_rejected(self, _otp, _send):
        request = self.client.post(
            '/users/forget_password/',
            {'identifier': self.user.username},
            format='json',
        )
        verify = self.client.post(
            '/users/otp_validation/',
            {'reset_id': request.data['reset_id'], 'otp': '000000'},
            format='json',
        )
        self.assertEqual(verify.status_code, 400)
        self.assertEqual(verify.data['detail'], 'Invalid OTP.')


class PushDeviceTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_authenticated_user_can_register_and_remove_device(self):
        user = User.objects.create_user(
            username='push_doctor',
            password='Password!42',
            user_type='doctor',
        )
        self.client.force_authenticate(user)
        token = 'ExponentPushToken[test-device-token]'

        registered = self.client.post(
            '/users/push_devices/',
            {'token': token, 'platform': 'ios'},
            format='json',
        )
        self.assertEqual(registered.status_code, 200)
        self.assertTrue(
            PushDevice.objects.filter(user=user, token=token, active=True).exists()
        )

        removed = self.client.delete(
            '/users/push_devices/',
            {'token': token},
            format='json',
        )
        self.assertEqual(removed.status_code, 204)
        self.assertFalse(PushDevice.objects.filter(token=token).exists())

    @patch('utils.push_notifications.requests.post')
    def test_push_sender_builds_an_expo_message(self, post):
        user = User.objects.create_user(
            username='notified_doctor',
            password='Password!42',
            user_type='doctor',
        )
        PushDevice.objects.create(
            user=user,
            token='ExponentPushToken[test-device-token]',
            platform='ios',
        )
        post.return_value.raise_for_status.return_value = None
        post.return_value.json.return_value = {
            'data': [{'status': 'ok', 'id': 'ticket-id'}]
        }

        sent = send_push_to_user(
            user,
            title='Incoming consultation',
            body='A patient is calling you.',
            data={'type': 'incoming_call'},
            channel_id='incoming-calls',
            ttl=60,
        )

        self.assertTrue(sent)
        message = post.call_args.kwargs['json'][0]
        self.assertEqual(message['channelId'], 'incoming-calls')
        self.assertEqual(message['data']['type'], 'incoming_call')
        self.assertEqual(message['ttl'], 60)
