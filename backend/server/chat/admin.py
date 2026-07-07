from django.contrib import admin

from .models import (
    Conversation,
    Message,
    MessageAttachment,
    MessageReaction,
)


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'patient', 'updated_at')
    search_fields = ('doctor__username', 'patient__username')


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'sender', 'created_at', 'read_at')
    search_fields = ('sender__username', 'body')


admin.site.register(MessageAttachment)
admin.site.register(MessageReaction)
