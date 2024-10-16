# Generated by Django 5.1.2 on 2024-10-18 10:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitor', '0008_remove_server_alert_count_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='server',
            name='alert_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='server',
            name='alert_sent_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='server',
            name='access_group',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='server',
            name='server_name',
            field=models.CharField(max_length=100),
        ),
    ]
