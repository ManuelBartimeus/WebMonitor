# serializers.py
import uptime
from rest_framework import serializers
from .models import Server

class ServerSerializer(serializers.ModelSerializer):
    uptime = serializers.SerializerMethodField()

    class Meta:
        model = Server
        fields = ['ip_address', 'uptime']  # Only return ip_address and uptime

    def get_uptime(self, obj):
        try:
            return uptime.uptime()
        except Exception as e:
            return "Unavailable"
