from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Ping
from .serializers import PingSerializer
import requests

@api_view(['POST'])
def ping_urls(request):
    urls = request.data.get('urls', [])
    for url in urls:
        try:
            response = requests.get(url, timeout=5)
            Ping.objects.create(url=url, status_code=response.status_code)
        except requests.exceptions.RequestException:
            Ping.objects.create(url=url, status_code=500)
    return Response({'message': 'Pings processed successfully.'})
