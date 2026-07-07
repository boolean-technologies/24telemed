import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('patient', '0005_patient_user'),
        ('call_log', '0012_rename_medical_note_calllog_medical_encounter'),
    ]

    operations = [
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('scheduled_time', models.DateTimeField()),
                ('duration_minutes', models.IntegerField(default=30)),
                ('reason', models.TextField(blank=True, null=True)),
                ('priority', models.IntegerField(choices=[(1, 'Low'), (2, 'Medium'), (3, 'High'), (4, 'Critical')], default=2)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Confirmed', 'Confirmed'), ('Declined', 'Declined'), ('Cancelled', 'Cancelled'), ('Completed', 'Completed')], default='Pending', max_length=20)),
                ('decline_note', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('call_log', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='call_log.calllog')),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings_received', to=settings.AUTH_USER_MODEL)),
                ('health_care_assistant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings_created', to=settings.AUTH_USER_MODEL)),
                ('patient', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='patient.patient')),
            ],
            options={
                'ordering': ['scheduled_time'],
            },
        ),
    ]
