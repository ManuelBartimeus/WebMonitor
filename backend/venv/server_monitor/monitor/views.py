from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Server
from .serializers import ServerSerializer
from ping3 import ping
from django.utils import timezone
import os
import uptime
from .utils import send_server_down_email

class ServerListView(APIView):
    def get(self, request):
        servers = Server.objects.all()
        server_data = []

        for server in servers:
            # Ping the server's IP address to check the status
            response_time = ping(server.ip_address)
            server_status = 'Active' if response_time is not None else 'Inactive'

            # Check if server status is changing from 'Active' to 'Inactive'
            if server.status == 'Active' and server_status == 'Inactive':
                # Send email notification when server goes down
                send_server_down_email(server.ip_address)

            # Update server status and last ping time
            server.status = server_status
            server.last_ping = timezone.now()
            server.save(update_fields=['status', 'last_ping'])

            # Append server data to the response
            server_data.append({
                'ip_address': server.ip_address,
                'status': server.status,
                'last_ping': server.last_ping.strftime('%Y-%m-%d %H:%M:%S')  # Format the timestamp
            })

        # Return the server data with updated status and last ping time
        return Response(server_data, status=status.HTTP_200_OK)
