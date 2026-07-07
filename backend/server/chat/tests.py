from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient

from call_log.models import CallLog
from file.models import File
from users.models import User
from .models import (
    Conversation,
    Message,
    MessageAttachment,
    MessageReaction,
)


class ConversationApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.doctor = User.objects.create_user(
            username='chat_doctor',
            password='Password!42',
            user_type='doctor',
        )
        self.patient = User.objects.create_user(
            username='chat_patient',
            password='Password!42',
            user_type='customer',
        )
        self.stranger = User.objects.create_user(
            username='chat_stranger',
            password='Password!42',
            user_type='customer',
        )
        CallLog.objects.create(
            doctor=self.doctor,
            health_care_assistant=self.patient,
        )

    def test_only_related_patient_can_open_conversation(self):
        self.client.force_authenticate(self.patient)
        response = self.client.post(
            '/chat/conversations/',
            {'participant_id': str(self.doctor.id)},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            Conversation.objects.filter(
                doctor=self.doctor, patient=self.patient
            ).exists()
        )

        self.client.force_authenticate(self.stranger)
        forbidden = self.client.post(
            '/chat/conversations/',
            {'participant_id': str(self.doctor.id)},
            format='json',
        )
        self.assertEqual(forbidden.status_code, 403)

    @patch('chat.views.send_push_to_user', return_value=True)
    def test_message_is_persisted_pushed_and_marked_read(self, push):
        conversation = Conversation.objects.create(
            doctor=self.doctor, patient=self.patient
        )
        self.client.force_authenticate(self.patient)
        sent = self.client.post(
            f'/chat/conversations/{conversation.id}/messages/',
            {'body': 'I have a follow-up question.'},
            format='json',
        )
        self.assertEqual(sent.status_code, 201)
        self.assertEqual(Message.objects.count(), 1)
        push.assert_called_once()

        self.client.force_authenticate(self.doctor)
        inbox = self.client.get('/chat/conversations/')
        self.assertEqual(inbox.data[0]['unread_count'], 1)
        messages = self.client.get(
            f'/chat/conversations/{conversation.id}/messages/'
        )
        self.assertEqual(messages.status_code, 200)
        self.assertIsNotNone(Message.objects.get().read_at)

    @patch('chat.views.send_push_to_user', return_value=True)
    def test_reply_and_reaction_are_scoped_to_conversation(self, _push):
        conversation = Conversation.objects.create(
            doctor=self.doctor, patient=self.patient
        )
        original = Message.objects.create(
            conversation=conversation,
            sender=self.doctor,
            body='How are you feeling?',
        )
        self.client.force_authenticate(self.patient)
        reply = self.client.post(
            f'/chat/conversations/{conversation.id}/messages/',
            {'body': 'Much better.', 'reply_to': str(original.id)},
            format='json',
        )
        self.assertEqual(reply.status_code, 201)
        self.assertEqual(reply.data['reply_to']['id'], str(original.id))

        reaction_url = (
            f'/chat/conversations/{conversation.id}/messages/'
            f'{original.id}/reaction/'
        )
        reacted = self.client.post(
            reaction_url, {'emoji': '👍'}, format='json'
        )
        self.assertEqual(reacted.status_code, 200)
        self.assertEqual(reacted.data['reaction_summary'][0]['count'], 1)
        self.assertTrue(reacted.data['reaction_summary'][0]['reacted_by_me'])
        self.assertEqual(MessageReaction.objects.count(), 1)

        toggled_off = self.client.post(
            reaction_url, {'emoji': '👍'}, format='json'
        )
        self.assertEqual(toggled_off.status_code, 200)
        self.assertEqual(toggled_off.data['reaction_summary'], [])

    @patch('chat.views.send_push_to_user', return_value=True)
    def test_attachment_only_message_is_stored(self, _push):
        conversation = Conversation.objects.create(
            doctor=self.doctor, patient=self.patient
        )
        upload = SimpleUploadedFile(
            'care-plan.pdf',
            b'example pdf content',
            content_type='application/pdf',
        )
        storage = File._meta.get_field('file').storage
        self.client.force_authenticate(self.doctor)
        with patch.object(
            storage, 'save', return_value='Uploads/care-plan.pdf'
        ):
            with patch.object(
                storage,
                'url',
                return_value='https://files.example/care-plan.pdf',
            ):
                sent = self.client.post(
                    f'/chat/conversations/{conversation.id}/messages/',
                    {'body': '', 'files': upload},
                    format='multipart',
                )
        self.assertEqual(sent.status_code, 201)
        self.assertEqual(sent.data['attachments'][0]['original_name'], 'care-plan.pdf')
        self.assertEqual(MessageAttachment.objects.count(), 1)
