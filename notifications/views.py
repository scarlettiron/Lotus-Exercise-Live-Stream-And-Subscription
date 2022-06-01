from rest_framework import generics, permissions

from . serializers import notifications_serializer
from . models import notifications

class notification_list(generics.ListAPIView):
    serializer_class = notifications_serializer
    queryset = notifications.objects.all()
    lookup_field = 'user'
    permission_classes = [permissions.IsAuthenticated]