# Generated by Django 4.0.4 on 2022-05-29 05:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('verification', '0004_remove_verification_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='verification',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('declined', 'Declined'), ('passed', 'Passed')], default='pending', max_length=30),
        ),
    ]
