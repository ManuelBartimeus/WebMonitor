from django.db import models
from django.utils import timezone
from datetime import timedelta

class Server(models.Model):
    ACCESS_GROUP_CHOICES = [
        ('IT Infrastructure', 'IT Infrastructure'),
        ('Active Management', 'Active Management'),
        ('Database Management', 'Database Management'),
        ('Networking', 'Networking'),
        ('Public Relations', 'Public Relations'),
        ('Application Development', 'Application Development'),
        ('Business Operations', 'Business Operations'),
    ]

    SERVER_LEVEL_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    ALERT_FREQUENCIES = [
        ('default', 'Default (every 30 seconds)'),
        ('1m', 'Every 1 minute'),
        ('5m', 'Every 5 minutes'),
        ('10m', 'Every 10 minutes'),
        ('30m', 'Every 30 minutes'),
    ]

    ALERT_DELAYS = [
        ('default', 'Default (No alert)'),
        ('1m', '1 minute'),
        ('5m', '5 minutes'),
        ('10m', '10 minutes'),
    ]

    ip_address = models.GenericIPAddressField(unique=True)
    server_name = models.CharField(max_length=100)  # Field for Server Name
    access_group = models.CharField(max_length=50, choices=ACCESS_GROUP_CHOICES)  # Field for Access Group with choices
    priority = models.CharField(max_length=20, choices=SERVER_LEVEL_CHOICES)  # Field for Priority
    status = models.CharField(max_length=10, default="Unknown")  # Optional
    last_ping = models.DateTimeField(auto_now=True)
    alert_sent_at = models.DateTimeField(null=True, blank=True)  # Time of the first alert
    alert_count = models.IntegerField(default=0)  # Number of alerts sent within the timeframe

    alert_permission = models.BooleanField(default=True)
    alert_frequency = models.CharField(max_length=10, choices=ALERT_FREQUENCIES, default='default')
    alert_delay = models.CharField(max_length=10, choices=ALERT_DELAYS, default='default')

    def reset_alert(self):
        """Reset the alert count and alert time after 5 minutes."""
        self.alert_sent_at = None
        self.alert_count = 0
        

    def __str__(self):
        return f"{self.server_name} ({self.ip_address})"  # Update the string representation

class DowntimeLog(models.Model):
    server = models.ForeignKey(Server, on_delete=models.CASCADE, related_name='downtime_logs')  # Relation to Server
    timestamp = models.DateTimeField(auto_now_add=True)  # When the downtime occurred
    reason = models.CharField(max_length=255)  # Reason for downtime
    duration = models.DurationField(null=True, blank=True)  # Duration of downtime

    def update_duration(self, recovery_time):
        """Update the duration with the time when the server came back online."""
        calculated_duration = recovery_time - self.timestamp
        if calculated_duration.total_seconds() >= 1:
            self.duration = calculated_duration
            self.save()

    def formatted_duration(self):
        """Format duration as HH:MM:SS."""
        if self.duration:
            total_seconds = int(self.duration.total_seconds())
            hours, remainder = divmod(total_seconds, 3600)
            minutes, seconds = divmod(remainder, 60)
            return f"{hours:02}:{minutes:02}:{seconds:02}"
        return 'Ongoing'  # If no duration, return 'Ongoing'

    def __str__(self):
        return f"{self.server.server_name} went down at {self.timestamp}"  # Update the string representation
