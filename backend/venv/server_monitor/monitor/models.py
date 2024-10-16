from django.db import models

class Server(models.Model):
    ip_address = models.GenericIPAddressField(unique=True)
    status = models.CharField(max_length=10, default="Unknown")  # Optional
    last_ping = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.ip_address
