# Generated by Django 4.0.4 on 2022-05-29 04:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('verification', '0003_delete_verificationstatus_alter_verification_reason'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='verification',
            name='status',
        ),
    ]
