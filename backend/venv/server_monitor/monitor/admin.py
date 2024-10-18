from django.contrib import admin
from .models import Server

@admin.register(Server)
class ServerAdmin(admin.ModelAdmin):
    list_display = ['ip_address', 'server_name', 'access_group', 'priority']  # Add new fields to display
    fields = ['ip_address', 'server_name', 'access_group', 'priority']  # Include new fields in admin form
