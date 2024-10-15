# serializers.py
import uptime
from rest_framework import serializers
from .models import Server

class ServerSerializer(serializers.ModelSerializer):
    uptime = serializers.SerializerMethodField()

    class Meta:
        model = Server
        fields = ['ip_address', 'url', 'status', 'speed', 'uptime']

    def get_uptime(self, obj):
        try:
            return uptime.uptime()  # Assuming you're using the uptime package here
        except Exception as e:
            return "Unavailable"
