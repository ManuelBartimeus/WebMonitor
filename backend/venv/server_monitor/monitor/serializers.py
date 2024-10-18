from rest_framework import serializers
from .models import Server
from ping3 import ping

class ServerSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Server
        fields = ['ip_address', 'server_name', 'access_group', 'priority', 'status']  # Include new fields

    def get_status(self, obj):
        # Ping the IP address
        response = ping(obj.ip_address, timeout=2)
        if response is not None:
            return "Active"  # Server is reachable
        else:
            return "Inactive"  # Server is unreachable
