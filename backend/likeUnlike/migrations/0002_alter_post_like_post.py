# Generated by Django 4.0.4 on 2022-10-28 04:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0010_post_tags'),
        ('likeUnlike', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post_like',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posts.post'),
        ),
    ]
