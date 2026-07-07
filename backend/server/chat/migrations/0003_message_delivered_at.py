from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_message_replies_reactions_attachments'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='delivered_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
