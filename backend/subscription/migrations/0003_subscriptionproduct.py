# Generated by Django 4.0.4 on 2022-04-30 04:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0014_alter_customerid_customerid'),
        ('subscription', '0002_subscription_auto_draft'),
    ]

    operations = [
        migrations.CreateModel(
            name='subscriptionProduct',
            fields=[
                ('st_productId', models.CharField(max_length=500)),
                ('st_priceId', models.CharField(max_length=500)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]