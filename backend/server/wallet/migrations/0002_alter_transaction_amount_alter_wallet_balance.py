# Generated by Django 4.2.9 on 2024-09-08 09:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("wallet", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="transaction",
            name="amount",
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name="wallet",
            name="balance",
            field=models.FloatField(default=0),
        ),
    ]