# Generated by Django 4.2.9 on 2024-10-24 08:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('file', '0001_initial'),
        ('users', '0015_remove_user_bvn'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='photo_url',
            field=models.URLField(blank=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='photo',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='file.file'),
        ),
    ]
