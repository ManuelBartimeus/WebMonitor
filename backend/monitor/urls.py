from django.urls import path
from .views import ping_urls

urlpatterns = [
    path('ping/', ping_urls, name='ping_urls'),
]
