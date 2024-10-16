from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Server
from .serializers import ServerSerializer
from ping3 import ping

class ServerListView(APIView):
    def get(self, request):
        servers = Server.objects.all()
        server_data = []

        for server in servers:
            # Ping the server to get the status
            response_time = ping(server.ip_address)
            server_status = 'Active' if response_time is not None else 'Inactive'
            server_data.append({
                'ip_address': server.ip_address,
                'status': server_status,
            })

        return Response(server_data, status=status.HTTP_200_OK)
