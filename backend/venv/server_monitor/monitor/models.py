from django.db import models
from django.utils import timezone

class Server(models.Model):
    ip_address = models.GenericIPAddressField(unique=True)
    status = models.CharField(max_length=10, default="Unknown")  # Optional
    last_ping = models.DateTimeField(auto_now=True)
    alert_sent_at = models.DateTimeField(null=True, blank=True)  # Time of the first alert
    alert_count = models.IntegerField(default=0)  # Number of alerts sent within the timeframe

    def reset_alert(self):
        """Reset the alert count and alert time after 5 minutes."""
        self.alert_sent_at = None
        self.alert_count = 0

    def __str__(self):
        return self.ip_address
