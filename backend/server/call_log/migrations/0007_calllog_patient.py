# Generated by Django 4.2.9 on 2024-03-08 12:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("patient", "0001_initial"),
        ("call_log", "0006_alter_calllog_call_type_alter_calllog_priority_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="calllog",
            name="patient",
            field=models.ForeignKey(
                default="3fa85f64-5717-4562-b3fc-2c963f66afa6",
                on_delete=django.db.models.deletion.CASCADE,
                to="patient.patient",
            ),
            preserve_default=False,
        ),
    ]
