# Generated by Django 4.0.4 on 2022-05-28 13:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='verificationStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='verification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photoId', models.ImageField(upload_to='verifications/photoId/')),
                ('certificate', models.ImageField(upload_to='verifications/certificates/')),
                ('reason', models.CharField(max_length=250)),
                ('status', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='verification.verificationstatus')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
