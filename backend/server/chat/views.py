from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from booking.models import Booking
from call_log.models import CallLog
from file.models import File
from users.models import User
from utils.push_notifications import send_push_to_user
from .models import (
    Conversation,
    Message,
    MessageAttachment,
    MessageReaction,
)
from .serializers import ConversationSerializer, MessageSerializer
from .services import ensure_conversation


class ConversationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        return (
            Conversation.objects.select_related(
                'doctor', 'doctor__photo', 'patient', 'patient__photo'
            )
            .filter(Q(doctor=user) | Q(patient=user))
            .distinct()
        )

    def list(self, request, *args, **kwargs):
        # Fetching my conversation list means my app is online, so mark
        # messages addressed to me as delivered (the second "grey" tick).
        Message.objects.filter(
            conversation__in=self.get_queryset(),
            delivered_at__isnull=True,
        ).exclude(sender=request.user).update(delivered_at=timezone.now())
        return super().list(request, *args, **kwargs)

    def create(self, request):
        participant_id = request.data.get('participant_id')
        try:
            participant = User.objects.get(id=participant_id)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response(
                {'detail': 'Participant not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if request.user.user_type == 'doctor':
            doctor, patient = request.user, participant
        elif request.user.user_type == 'customer':
            doctor, patient = participant, request.user
        else:
            return Response(
                {'detail': 'Only doctors and patients can use chat.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        if doctor.user_type != 'doctor' or patient.user_type != 'customer':
            return Response(
                {'detail': 'A conversation must be between a doctor and patient.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        related = (
            CallLog.objects.filter(
                doctor=doctor, health_care_assistant=patient
            ).exists()
            or Booking.objects.filter(
                doctor=doctor, health_care_assistant=patient
            ).exists()
        )
        if not related:
            return Response(
                {'detail': 'Chat becomes available after a booking or consultation.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        conversation = ensure_conversation(doctor, patient)
        return Response(
            self.get_serializer(conversation).data,
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=['get', 'post'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        if request.method == 'GET':
            # Opening the thread marks incoming messages read (blue ticks); any
            # that hadn't been marked delivered yet get both timestamps.
            now = timezone.now()
            incoming = conversation.messages.exclude(sender=request.user)
            incoming.filter(delivered_at__isnull=True).update(delivered_at=now)
            incoming.filter(read_at__isnull=True).update(read_at=now)
            messages = (
                conversation.messages.select_related(
                    'sender', 'reply_to', 'reply_to__sender'
                )
                .prefetch_related(
                    'attachments__file',
                    'reply_to__attachments',
                    'reactions',
                )
                .all()
            )
            return Response(
                MessageSerializer(
                    messages, many=True, context={'request': request}
                ).data
            )

        body = (request.data.get('body') or '').strip()
        uploads = request.FILES.getlist('files')
        if not body and not uploads:
            return Response(
                {'detail': 'Add a message or attachment.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(uploads) > 5:
            return Response(
                {'detail': 'You can attach up to 5 files at once.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        for upload in uploads:
            if upload.size > 10 * 1024 * 1024:
                return Response(
                    {'detail': f'{upload.name} is larger than 10 MB.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        reply_to = None
        reply_to_id = request.data.get('reply_to')
        if reply_to_id:
            reply_to = conversation.messages.filter(id=reply_to_id).first()
            if not reply_to:
                return Response(
                    {'detail': 'The replied-to message was not found.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        with transaction.atomic():
            message = Message.objects.create(
                conversation=conversation,
                sender=request.user,
                body=body[:4000],
                reply_to=reply_to,
            )
            for upload in uploads:
                stored = File.objects.create(file=upload)
                MessageAttachment.objects.create(
                    message=message,
                    file=stored,
                    original_name=(upload.name or 'attachment')[:255],
                    content_type=(upload.content_type or '')[:150],
                    size=upload.size,
                )
        conversation.save(update_fields=['updated_at'])
        recipient = (
            conversation.patient
            if request.user.id == conversation.doctor_id
            else conversation.doctor
        )
        recipient_role = 'patient' if recipient.user_type == 'customer' else 'doctor'
        sender_name = request.user.get_full_name() or request.user.username
        send_push_to_user(
            recipient,
            title=f'New message from {sender_name}',
            body=(message.body[:120] or 'Sent an attachment'),
            data={
                'type': 'chat_message',
                'conversation_id': str(conversation.id),
                'route': f'/({recipient_role})/chat/{conversation.id}',
            },
            channel_id='messages',
        )
        return Response(
            MessageSerializer(message, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=['post'],
        url_path=r'messages/(?P<message_id>[^/.]+)/reaction',
    )
    def reaction(self, request, pk=None, message_id=None):
        conversation = self.get_object()
        message = conversation.messages.filter(id=message_id).first()
        if not message:
            return Response(
                {'detail': 'Message not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        emoji = request.data.get('emoji')
        allowed = {'👍', '❤️', '😂', '😮', '😢', '🙏'}
        if emoji not in allowed:
            return Response(
                {'detail': 'Choose a supported reaction.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        current = MessageReaction.objects.filter(
            message=message, user=request.user
        ).first()
        if current and current.emoji == emoji:
            current.delete()
        else:
            MessageReaction.objects.update_or_create(
                message=message,
                user=request.user,
                defaults={'emoji': emoji},
            )

        message = (
            Message.objects.select_related(
                'sender', 'reply_to', 'reply_to__sender'
            )
            .prefetch_related(
                'attachments__file',
                'reply_to__attachments',
                'reactions',
            )
            .get(id=message.id)
        )
        return Response(
            MessageSerializer(message, context={'request': request}).data
        )
