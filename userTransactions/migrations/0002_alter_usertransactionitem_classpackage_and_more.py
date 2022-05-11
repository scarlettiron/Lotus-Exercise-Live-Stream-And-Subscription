# Generated by Django 4.0.4 on 2022-05-02 19:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('classPackages', '0003_rename_duration_units_publicpackage_duration'),
        ('posts', '0008_alter_postproductid_post'),
        ('subscription', '0006_subscription_product_user'),
        ('userTransactions', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usertransactionitem',
            name='classPackage',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='classPackages.publicpackage'),
        ),
        migrations.AlterField(
            model_name='usertransactionitem',
            name='post',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='posts.post'),
        ),
        migrations.AlterField(
            model_name='usertransactionitem',
            name='subscription',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='subscription.subscription'),
        ),
    ]
