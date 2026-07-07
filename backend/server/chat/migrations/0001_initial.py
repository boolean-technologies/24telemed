import uuid

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def backfill_conversations(apps, schema_editor):
    Conversation = apps.get_model('chat', 'Conversation')
    CallLog = apps.get_model('call_log', 'CallLog')
    Booking = apps.get_model('booking', 'Booking')
    User = apps.get_model('users', 'User')
    # The swappable user dependency exposes the historical User model before
    # ``user_type`` was added. A linked Patient record is the stable marker
    # available at this point in the migration graph.
    customer_ids = User.objects.filter(
        patient_profile__isnull=False
    ).values_list('id', flat=True)

    pairs = set(
        CallLog.objects.filter(health_care_assistant_id__in=customer_ids)
        .values_list('doctor_id', 'health_care_assistant_id')
    )
    pairs.update(
        Booking.objects.filter(health_care_assistant_id__in=customer_ids)
        .values_list('doctor_id', 'health_care_assistant_id')
    )
    Conversation.objects.bulk_create(
        [
            Conversation(doctor_id=doctor_id, patient_id=patient_id)
            for doctor_id, patient_id in pairs
        ],
        ignore_conflicts=True,
    )


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('booking', '0002_booking_reminder_sent_at'),
        ('call_log', '0012_rename_medical_note_calllog_medical_encounter'),
    ]

    operations = [
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='doctor_conversations', to=settings.AUTH_USER_MODEL)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='patient_conversations', to=settings.AUTH_USER_MODEL)),
            ],
            options={'ordering': ['-updated_at']},
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('body', models.TextField(max_length=4000)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('read_at', models.DateTimeField(blank=True, null=True)),
                ('conversation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='chat.conversation')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chat_messages', to=settings.AUTH_USER_MODEL)),
            ],
            options={'ordering': ['created_at']},
        ),
        migrations.AddConstraint(
            model_name='conversation',
            constraint=models.UniqueConstraint(fields=('doctor', 'patient'), name='unique_doctor_patient_conversation'),
        ),
        migrations.RunPython(backfill_conversations, migrations.RunPython.noop),
    ]
