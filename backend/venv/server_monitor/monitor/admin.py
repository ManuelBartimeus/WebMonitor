from django.contrib import admin
from .models import Server

@admin.register(Server)
class ServerAdmin(admin.ModelAdmin):
    list_display = ['ip_address', 'server_name', 'access_group', 'priority']  # Added more fields to display
    fields = ['ip_address', 'server_name', 'access_group', 'priority']  # Include all relevant fields in admin form
   