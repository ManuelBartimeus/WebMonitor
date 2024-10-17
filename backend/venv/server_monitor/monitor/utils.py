# monitoring/utils.py

from django.core.mail import send_mail
from django.conf import settings

def send_server_down_email(ip_address, alert_degree):
    subject = f"Server Downtime Alert: {ip_address} ({alert_degree})"
    message = f"The server with IP Address {ip_address} is down. \n\nAlert Degree: {alert_degree} \nPlease render all necessary checks to get it back online."
    email_from = settings.DEFAULT_FROM_EMAIL
    recipient_list = ['eliteservicesagency3@gmail.com']  # Add the recipient's email
    send_mail(subject, message, email_from, recipient_list)
