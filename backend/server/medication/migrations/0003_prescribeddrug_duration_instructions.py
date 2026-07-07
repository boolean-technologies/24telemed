from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medication', '0002_alter_medicalencounter_doctor_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='prescribeddrug',
            name='duration',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='prescribeddrug',
            name='instructions',
            field=models.TextField(blank=True),
        ),
    ]
