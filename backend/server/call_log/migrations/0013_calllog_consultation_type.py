from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('call_log', '0012_rename_medical_note_calllog_medical_encounter'),
    ]

    operations = [
        migrations.AddField(
            model_name='calllog',
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
