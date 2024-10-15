from django.db import models

class Server(models.Model):
    ip_address = models.GenericIPAddressField(unique=True)
    url = models.URLField()
    status = models.CharField(max_length=10)
    speed = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.ip_address} - {self.url}"
