from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Server
from .serializers import ServerSerializer
from ping3 import ping
from django.utils import timezone

class ServerListView(APIView):
    def get(self, request):
        servers = Server.objects.all()
        server_data = []

        for server in servers:
            response_time = ping(server.ip_address)
            server_status = 'Active' if response_time is not None else 'Inactive'
            server.status = server_status  # Update the server status based on ping
            server.last_ping = timezone.now()  # Update last ping time
            server.save(update_fields=['status', 'last_ping'])  # Save the updated fields

            server_data.append({
                'ip_address': server.ip_address,
                'status': server.status,
                'last_ping': server.last_ping.strftime('%Y-%m-%d %H:%M:%S')  # Format the timestamp
            })

        return Response(server_data, status=status.HTTP_200_OK)
