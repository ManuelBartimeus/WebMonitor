# Generated by Django 5.1.2 on 2024-10-22 10:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitor', '0014_alter_server_priority'),
    ]

    operations = [
        migrations.CreateModel(
            name='DowntimeLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('reason', models.CharField(max_length=255)),
                ('server', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='downtime_logs', to='monitor.server')),
            ],
        ),
    ]
