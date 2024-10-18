from django.db import models
from django.utils import timezone

class Server(models.Model):
    ip_address = models.GenericIPAddressField(unique=True)
    server_name = models.CharField(max_length=100)  # New field for Server Name
    access_group = models.CharField(max_length=100)  # New field for Access Group
    priority = models.IntegerField(default=1)  # New field for Priority
    status = models.CharField(max_length=10, default="Unknown")  # Optional
    last_ping = models.DateTimeField(auto_now=True)
    alert_sent_at = models.DateTimeField(null=True, blank=True)  # Time of the first alert
    alert_count = models.IntegerField(default=0)  # Number of alerts sent within the timeframe

    def reset_alert(self):
        """Reset the alert count and alert time after 5 minutes."""
        self.alert_sent_at = None
        self.alert_count = 0

    def __str__(self):
        return f"{self.server_name} ({self.ip_address})"  # Update the string representation
