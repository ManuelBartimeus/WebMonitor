# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Server
from .serializers import ServerSerializer

class ServerListView(APIView):
    def get(self, request):
        servers = Server.objects.all()
        serializer = ServerSerializer(servers, many=True)
        return Response(serializer.data)
