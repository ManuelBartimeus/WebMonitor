from django.db import models

class Server(models.Model):
    ip_address = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=10, default="Unknown")  # Optional

    def __str__(self):
        return self.ip_address
