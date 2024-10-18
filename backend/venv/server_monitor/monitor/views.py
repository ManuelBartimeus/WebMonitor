from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Server
from ping3 import ping
from django.utils import timezone
from datetime import timedelta
from .utils import send_server_down_email

class ServerListView(APIView):
    def get(self, request):
        servers = Server.objects.all()
        server_data = []

        for server in servers:
            # Ping the server's IP address to check the status
            response_time = ping(server.ip_address)
            server_status = 'Active' if response_time is not None else 'Inactive'

            if server_status == 'Inactive':
                # Calculate the time since the last alert was sent
                now = timezone.now()

                # Check if the alert needs to be reset (after 5 minutes)
                if server.alert_sent_at and (now - server.alert_sent_at) > timedelta(minutes=30):
                    server.reset_alert()

                # Define the alert degree based on the number of alerts sent
                if server.alert_count == 0:
                    alert_degree = "LOW ALERT"
                    send_server_down_email(server.ip_address, alert_degree)
                    server.alert_sent_at = now
                    server.alert_count = 1
                elif server.alert_count == 1 and (now - server.alert_sent_at) <= timedelta(seconds=18000):
                    alert_degree = "MEDIUM ALERT"
                    send_server_down_email(server.ip_address, alert_degree)
                    server.alert_count = 2
                elif server.alert_count == 2 and (now - server.alert_sent_at) <= timedelta(seconds=18000):
                    alert_degree = "HIGH ALERT"
                    send_server_down_email(server.ip_address, alert_degree)
                    server.alert_count = 3
                # No more alerts after the third within the first 60 seconds
                # Wait for 5 minutes before resetting alerts

            # Update server status and last ping time
            server.status = server_status
            server.last_ping = timezone.now()
            server.save(update_fields=['status', 'last_ping', 'alert_sent_at', 'alert_count'])

            # Append server data to the response
            server_data.append({
                'ip_address': server.ip_address,
                'status': server.status,
                'last_ping': server.last_ping.strftime('%Y-%m-%d %H:%M:%S')  # Format the timestamp
            })

        return Response(server_data, status=status.HTTP_200_OK)

    def post(self, request):
        # Extract the IP address from the request data
        ip_address = request.data.get('ip_address')

        if not ip_address:
            return Response({'error': 'IP Address is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the server already exists
        if Server.objects.filter(ip_address=ip_address).exists():
            return Response({'error': 'Server with this IP Address already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new server instance
        server = Server(ip_address=ip_address)

        # Save the server to the database
        server.save()

        return Response({'ip_address': server.ip_address}, status=status.HTTP_201_CREATED)

    def delete(self, request, ip_address):
        try:
            server = Server.objects.get(ip_address=ip_address)
            server.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Server.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
