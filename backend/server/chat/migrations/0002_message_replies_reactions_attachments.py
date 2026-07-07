import uuid

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
        ('file', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='body',
            field=models.TextField(blank=True, default='', max_length=4000),
        ),
        migrations.AddField(
            model_name='message',
            name='reply_to',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='replies',
                to='chat.message',
            ),
        ),
        migrations.CreateModel(
            name='MessageAttachment',
            fields=[
                (
                    'id',
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ('original_name', models.CharField(max_length=255)),
                ('content_type', models.CharField(blank=True, max_length=150)),
                ('size', models.PositiveBigIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                (
                    'file',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to='file.file',
                    ),
                ),
                (
                    'message',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='attachments',
                        to='chat.message',
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name='MessageReaction',
            fields=[
                (
                    'id',
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ('emoji', models.CharField(max_length=16)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                (
                    'message',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='reactions',
                        to='chat.message',
                    ),
                ),
                (
                    'user',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='message_reactions',
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddConstraint(
            model_name='messagereaction',
            constraint=models.UniqueConstraint(
                fields=('message', 'user'),
                name='one_reaction_per_user_per_message',
            ),
        ),
    ]
