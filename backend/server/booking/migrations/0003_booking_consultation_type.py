from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0002_booking_reminder_sent_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='consultation_type',
            field=models.CharField(
                choices=[
                    ('e_consultation', 'E-consultation'),
                    ('second_opinion', 'Second Medical Opinion'),
                    ('nursing_visit', 'Virtual Nursing Home Visit'),
                ],
                default='e_consultation',
                max_length=20,
            ),
        ),
    ]
