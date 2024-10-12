from django.db import models

class Ping(models.Model):
    url = models.URLField(max_length=200)
    status_code = models.IntegerField()
    checked_at = models.DateTimeField(auto_now_add=True)
