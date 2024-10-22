from django.urls import path
from .views import ServerListView, DowntimeLogView  # Import the new view

urlpatterns = [
    path('api/servers/', ServerListView.as_view(), name='server-list'),
    path('api/servers/<str:ip_address>/', ServerListView.as_view(), name='server-detail'),  # Use the same view for detail
    path('api/logs/<str:ip_address>/', DowntimeLogView.as_view(), name='get_downtime_logs'),  # Use the DowntimeLogView class
]
