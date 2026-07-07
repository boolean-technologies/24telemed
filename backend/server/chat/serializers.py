from rest_framework import serializers

from .models import Conversation, Message, MessageAttachment


def user_summary(user):
    photo = None
    if user.photo and user.photo.file:
        photo = user.photo.file.url
    return {
        'id': str(user.id),
        'first_name': user.first_name,
        'last_name': user.last_name,
        'username': user.username,
        'photo': photo,
        'specialty': user.specialty,
    }


class MessageAttachmentSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = MessageAttachment
        fields = ['id', 'url', 'original_name', 'content_type', 'size']
        read_only_fields = fields

    def get_url(self, obj):
        return obj.file.file.url if obj.file and obj.file.file else None


class MessageSerializer(serializers.ModelSerializer):
    is_mine = serializers.SerializerMethodField()
    reply_to = serializers.SerializerMethodField()
    attachments = MessageAttachmentSerializer(many=True, read_only=True)
    reaction_summary = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id',
            'sender',
            'body',
            'reply_to',
            'attachments',
            'reaction_summary',
            'created_at',
            'delivered_at',
            'read_at',
            'is_mine',
        ]
        read_only_fields = fields

    def get_is_mine(self, obj):
        request = self.context.get('request')
        return bool(request and obj.sender_id == request.user.id)

    def get_reply_to(self, obj):
        if not obj.reply_to:
            return None
        attachment = obj.reply_to.attachments.first()
        return {
            'id': str(obj.reply_to.id),
            'sender': str(obj.reply_to.sender_id),
            'body': obj.reply_to.body,
            'attachment_name': (
                attachment.original_name if attachment else None
            ),
        }

    def get_reaction_summary(self, obj):
        request = self.context.get('request')
        counts = {}
        mine = None
        for reaction in obj.reactions.all():
            counts[reaction.emoji] = counts.get(reaction.emoji, 0) + 1
            if request and reaction.user_id == request.user.id:
                mine = reaction.emoji
        return [
            {
                'emoji': emoji,
                'count': count,
                'reacted_by_me': emoji == mine,
            }
            for emoji, count in counts.items()
        ]


class ConversationSerializer(serializers.ModelSerializer):
    counterpart = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id',
            'counterpart',
            'last_message',
            'unread_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields

    def get_counterpart(self, obj):
        request = self.context['request']
        user = obj.patient if request.user.user_type == 'doctor' else obj.doctor
        return user_summary(user)

    def get_last_message(self, obj):
        message = obj.messages.order_by('-created_at').first()
        return (
            MessageSerializer(message, context=self.context).data
            if message
            else None
        )

    def get_unread_count(self, obj):
        request = self.context['request']
        return obj.messages.filter(read_at__isnull=True).exclude(
            sender=request.user
        ).count()
