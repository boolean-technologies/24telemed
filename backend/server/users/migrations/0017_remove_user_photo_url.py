# Generated by Django 4.2.9 on 2024-10-24 09:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0016_user_photo_url_alter_user_photo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='photo_url',
        ),
    ]
