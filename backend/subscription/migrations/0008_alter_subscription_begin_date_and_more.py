# Generated by Django 4.0.4 on 2022-05-14 22:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscription', '0007_subscription_st_subid_alter_subscription_begin_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subscription',
            name='begin_date',
            field=models.DateTimeField(max_length=50),
        ),
        migrations.AlterField(
            model_name='subscription',
            name='end_date',
            field=models.DateTimeField(max_length=50),
        ),
    ]
