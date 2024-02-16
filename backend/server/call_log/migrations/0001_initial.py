# Generated by Django 4.2.9 on 2024-01-25 20:30

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CallLog',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('start_time', models.DateTimeField(auto_now_add=True)),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(choices=[('Initiated', 'Initiated'), ('In Progress', 'In Progress'), ('Completed', 'Completed'), ('Declined', 'Declined'), ('Failed', 'Failed')], max_length=20)),
                ('patient_id', models.UUIDField(blank=True, null=True)),
                ('call_type', models.CharField(choices=[('Video', 'Video'), ('Audio', 'Audio')], max_length=10)),
                ('notes', models.TextField(blank=True, null=True)),
                ('duration', models.IntegerField(blank=True, null=True)),
                ('call_data', models.JSONField(blank=True, null=True)),
                ('priority', models.IntegerField(choices=[(4, 'CRITICAL'), (3, 'HIGH'), (2, 'MEDIUM'), (1, 'LOW')])),
            ],
        ),
    ]