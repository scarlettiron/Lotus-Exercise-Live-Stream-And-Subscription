# Generated by Django 4.0.2 on 2022-02-26 01:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='custom_profile',
            name='is_instructor',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='custom_profile',
            name='is_verified',
            field=models.BooleanField(default=False),
        ),
    ]
