# Generated by Django 4.0.4 on 2022-05-28 23:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0019_rename_balance_creator_balance_units'),
    ]

    operations = [
        migrations.AlterField(
            model_name='custom_profile',
            name='balance',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.creator_balance'),
        ),
    ]