import uuid

from django.conf import settings
from django.db import models
from file.models import File


class Conversation(models.Model):
    """A private doctor/patient thread created from a consultation relationship."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='doctor_conversations',
    )
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='patient_conversations',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['doctor', 'patient'],
                name='unique_doctor_patient_conversation',
            )
        ]
        ordering = ['-updated_at']


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name='messages'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_messages',
    )
    body = models.TextField(max_length=4000, blank=True, default='')
    reply_to = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        related_name='replies',
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    # Set when the recipient's app has fetched the message (≈ "delivered").
    delivered_at = models.DateTimeField(null=True, blank=True)
    # Set when the recipient has opened the conversation (≈ "read").
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['created_at']


class MessageAttachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message = models.ForeignKey(
        Message, on_delete=models.CASCADE, related_name='attachments'
    )
    file = models.ForeignKey(File, on_delete=models.CASCADE)
    original_name = models.CharField(max_length=255)
    content_type = models.CharField(max_length=150, blank=True)
    size = models.PositiveBigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)


class MessageReaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message = models.ForeignKey(
        Message, on_delete=models.CASCADE, related_name='reactions'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='message_reactions',
    )
    emoji = models.CharField(max_length=16)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['message', 'user'],
                name='one_reaction_per_user_per_message',
            )
        ]
