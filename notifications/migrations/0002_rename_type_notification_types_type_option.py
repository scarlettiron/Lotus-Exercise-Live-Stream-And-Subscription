# Generated by Django 4.0.3 on 2022-04-01 05:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='notification_types',
            old_name='type',
            new_name='type_option',
        ),
    ]
