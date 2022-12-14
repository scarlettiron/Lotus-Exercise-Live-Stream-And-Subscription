# Generated by Django 4.0.3 on 2022-04-27 19:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('posts', '0004_alter_post_body'),
        ('subscription', '0001_initial'),
        ('classPackages', '0003_rename_duration_units_publicpackage_duration'),
    ]

    operations = [
        migrations.CreateModel(
            name='siteTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_created=True)),
                ('st_transaction_id', models.TextField()),
                ('units', models.IntegerField()),
                ('is_payment', models.BooleanField()),
                ('is_refund', models.BooleanField()),
                ('classPackage', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='classPackages.publicpackage')),
                ('customerId', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.customerid')),
                ('post', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='posts.post')),
                ('subscription', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='subscription.subscription')),
            ],
            options={
                'ordering': ['-date'],
            },
        ),
    ]
