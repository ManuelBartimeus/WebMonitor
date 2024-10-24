# Generated by Django 5.1.2 on 2024-10-18 09:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitor', '0005_server_alert_count_server_alert_sent_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='server',
            name='access_group',
            field=models.CharField(default='General Access', max_length=100),
        ),
        migrations.AddField(
            model_name='server',
            name='priority',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='server',
            name='server_name',
            field=models.CharField(default='Unnamed Server', max_length=100),
        ),
    ]
