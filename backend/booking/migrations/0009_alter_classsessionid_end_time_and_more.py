# Generated by Django 4.0.4 on 2022-05-14 19:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0008_rename_date_classsessionid_end_time_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='classsessionid',
            name='end_time',
            field=models.DateTimeField(max_length=100),
        ),
        migrations.AlterField(
            model_name='classsessionid',
            name='start_time',
            field=models.DateTimeField(max_length=100),
        ),
    ]