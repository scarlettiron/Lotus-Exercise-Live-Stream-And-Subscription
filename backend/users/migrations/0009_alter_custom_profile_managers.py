# Generated by Django 4.0.2 on 2022-03-09 19:29

import django.contrib.auth.models
from django.db import migrations
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_alter_custom_profile_managers'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='custom_profile',
            managers=[
                ('extra_manager', users.models.profile_manager()),
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]
