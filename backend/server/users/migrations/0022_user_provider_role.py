from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0021_pushdevice_passwordresetrequest'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='provider_role',
            field=models.CharField(
                choices=[('doctor', 'Doctor'), ('nurse', 'Nurse')],
                default='doctor',
                max_length=20,
            ),
        ),
    ]
