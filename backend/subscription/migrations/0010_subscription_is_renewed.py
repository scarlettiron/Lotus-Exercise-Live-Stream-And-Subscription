# Generated by Django 4.0.4 on 2022-10-25 06:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscription', '0009_alter_subscription_begin_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscription',
            name='is_renewed',
            field=models.BooleanField(default=True),
        ),
    ]