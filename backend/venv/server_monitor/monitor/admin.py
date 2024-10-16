# admin.py
from django.contrib import admin
from .models import Server

@admin.register(Server)
class ServerAdmin(admin.ModelAdmin):
    list_display = ['ip_address']  # Only display ip_address
    fields = ['ip_address']        # Only allow input of ip_address
