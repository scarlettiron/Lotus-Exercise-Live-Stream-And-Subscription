# Generated by Django 4.0.2 on 2022-02-28 20:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_custom_profile_is_instructor_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='custom_profile',
            name='bio',
            field=models.CharField(blank=True, max_length=1000),
        ),
    ]
