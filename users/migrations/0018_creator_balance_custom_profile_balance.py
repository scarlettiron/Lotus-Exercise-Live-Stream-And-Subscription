# Generated by Django 4.0.4 on 2022-05-28 15:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0017_remove_custom_profile_subscription_product'),
    ]

    operations = [
        migrations.CreateModel(
            name='creator_balance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('balance', models.BigIntegerField()),
            ],
        ),
        migrations.AddField(
            model_name='custom_profile',
            name='balance',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.creator_balance'),
        ),
    ]
