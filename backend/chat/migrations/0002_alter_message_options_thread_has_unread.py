# Generated by Django 4.0.3 on 2022-04-17 17:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='message',
            options={'ordering': ['-pk']},
        ),
        migrations.AddField(
            model_name='thread',
            name='has_unread',
            field=models.BooleanField(default=True),
        ),
    ]
