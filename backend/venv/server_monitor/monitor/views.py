from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Server, DowntimeLog  # Ensure you import the DowntimeLog model
from ping3 import ping
from django.utils import timezone
from .utils import send_server_down_email
from datetime import timedelta

class ServerListView(APIView):
    def get(self, request):
        # Extract filter parameters from request
        access_group = request.query_params.get('access_group', None)
        priority = request.query_params.get('priority', None)
        status_filter = request.query_params.get('status', None)

        # Base query for all servers
        servers = Server.objects.all()

        # Apply filters if provided
        if access_group:
            servers = servers.filter(access_group=access_group)
        if priority:
            servers = servers.filter(priority=priority)
        if status_filter:
            servers = servers.filter(status=status_filter)

        # Process the server list
        server_data = []
        now = timezone.now()  # Get the current time once for efficiency

        for server in servers:
            # Ping the server's IP address to check the status
            response_time = ping(server.ip_address)
            server_status = 'Active' if response_time is not None else 'Inactive'

            if server_status == 'Inactive':
                # Check if there is already a downtime log for this server that hasn't ended
                active_downtime_log = DowntimeLog.objects.filter(server=server, duration__isnull=True).last()

                if active_downtime_log:
                    # Update the duration continuously; no recovery_time needed here
                    active_downtime_log.update_duration(now)  # Pass current time as recovery_time
                else:
                    DowntimeLog.objects.create(server=server, reason='Server is unreachable')

                # Alert frequency mapping
                alert_frequency_mapping = {
                    'default': 30,  # 30 seconds
                    '1m': 60,       # 1 minute
                    '5m': 300,      # 5 minutes
                    '10m': 600,     # 10 minutes
                    '30m': 1800,    # 30 minutes
                }

                # Determine the alert interval based on server's frequency setting
                alert_interval = alert_frequency_mapping.get(server.alert_frequency, 30)

                # Alert delay mapping
                alert_delay_mapping = {
                    'default': 0,   # No delay
                    '1m': 60,       # 1 minute
                    '5m': 300,      # 5 minutes
                    '10m': 600,     # 10 minutes
                }

                # Determine the alert delay based on server's delay setting
                alert_delay = alert_delay_mapping.get(server.alert_delay, 0)

                # Check if an alert needs to be sent
                if server.alert_sent_at is None:
                    # Set the alert timer based on the alert delay
                    server.alert_timer = now + timedelta(seconds=alert_delay)
                    server.save()  # Save the timer for the first alert

                # If the alert timer has passed, send the first alert
                if now >= server.alert_timer:
                    # First alert
                    send_server_down_email(server.ip_address, "LOW ALERT")
                    server.alert_sent_at = now
                    server.alert_count = 1
                else:
                    # Check the time since the last alert
                    elapsed_time_since_last_alert = (now - server.alert_sent_at).total_seconds()

                    # Only send alerts based on the specified alert interval
                    if elapsed_time_since_last_alert >= alert_interval:
                        server.alert_count += 1
                        if server.alert_count == 2:
                            alert_degree = "MEDIUM ALERT"
                        elif server.alert_count >= 3:
                            alert_degree = "HIGH ALERT"
                        else:
                            alert_degree = "LOW ALERT"

                        # Send alert only if the alert count has changed
                        send_server_down_email(server.ip_address, alert_degree)
                        server.alert_sent_at = now  # Update alert time after sending alert

            else:
                # If the server is back up, reset the alert parameters
                active_downtime_log = DowntimeLog.objects.filter(server=server, duration__isnull=True).last()
                if active_downtime_log:
                    active_downtime_log.update_duration(now)  # Pass current time as recovery_time to finalize duration

                # Reset alerts if server is back up
                server.alert_sent_at = None
                server.alert_count = 0
                if hasattr(server, 'alert_timer'):
                    del server.alert_timer  # Remove the alert timer if server is back up

            # Update server status and last ping time
            server.status = server_status
            server.last_ping = now
            server.save(update_fields=['status', 'last_ping', 'alert_sent_at', 'alert_count'])  # Update alert_count

            # Append server data to the response
            server_data.append({
                'ip_address': server.ip_address,
                'server_name': server.server_name,
                'access_group': server.access_group,
                'priority': server.priority,
                'status': server.status,
                'last_ping': server.last_ping.strftime('%Y-%m-%d %H:%M:%S'),  # Format the timestamp
                'alert_frequency': server.alert_frequency,
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

        # Determine the priority for the new server
        priority = request.data.get('priority', 'Low')

        # Create a new server instance with default values for alert fields
        server = Server(
            ip_address=ip_address,
            server_name=request.data.get('server_name', 'Unnamed Server'),
            access_group=request.data.get('access_group', 'IT Infrastructure'),
            priority=priority,
            alert_permission=(priority != 'Low'),
            alert_frequency=request.data.get('alert_frequency', 'default'),
            alert_delay=request.data.get('alert_delay', 'default')
        )

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

# New view to retrieve downtime logs
class DowntimeLogView(APIView):
    def get(self, request, ip_address):
        try:
            server = Server.objects.get(ip_address=ip_address)
            logs = DowntimeLog.objects.filter(server=server).order_by('-timestamp')
            log_data = [{
                'timestamp': log.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'reason': log.reason,
                'duration': log.formatted_duration()  # Use the formatted_duration method
            } for log in logs]
            return Response({'logs': log_data}, status=status.HTTP_200_OK)
        except Server.DoesNotExist:
            return Response({'error': 'Server not found'}, status=status.HTTP_404_NOT_FOUND)
