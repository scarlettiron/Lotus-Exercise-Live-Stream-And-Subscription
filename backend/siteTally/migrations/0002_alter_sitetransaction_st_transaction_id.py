# Generated by Django 4.0.4 on 2022-05-02 18:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('siteTally', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sitetransaction',
            name='st_transaction_id',
            field=models.CharField(max_length=500),
        ),
    ]