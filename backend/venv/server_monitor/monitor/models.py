# models.py
from django.db import models

class Server(models.Model):
    ip_address = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.ip_address
