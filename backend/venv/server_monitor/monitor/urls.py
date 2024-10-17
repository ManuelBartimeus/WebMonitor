from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServerListView

# router = DefaultRouter()
# router.register(r'servers', ServerViewSet)

urlpatterns = [
    path('api/servers/', ServerListView.as_view(), name='server-list'),
    path('api/servers/<str:ip_address>/', ServerListView.as_view(), name='server-detail'),  # Use the same view for detail
]