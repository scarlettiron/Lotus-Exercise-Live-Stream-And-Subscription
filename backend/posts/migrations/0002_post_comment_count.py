# Generated by Django 4.0.3 on 2022-03-27 01:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='comment_count',
            field=models.ImageField(default=0, upload_to=''),
        ),
    ]