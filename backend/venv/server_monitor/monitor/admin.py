from django.contrib import admin
from .models import Server, DowntimeLog  # Ensure you import the DowntimeLog model

@admin.register(Server)
class ServerAdmin(admin.ModelAdmin):
    list_display = ['ip_address', 'server_name', 'access_group', 'priority']  # Added more fields to display
    fields = ['ip_address', 'server_name', 'access_group', 'priority']  # Include all relevant fields in admin form

@admin.register(DowntimeLog)  # Register the DowntimeLog model
class DowntimeLogAdmin(admin.ModelAdmin):
    list_display = ('server', 'timestamp', 'reason')  # Customize what fields to display in the list view
    search_fields = ('server__server_name', 'reason')  # Allow searching by server name and reason
    list_filter = ('server', 'timestamp')  # Enable filtering by server and timestamp
