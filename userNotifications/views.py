from rest_framework import generics, permissions

from .models import user_notification
from .serializers import notifications_serializer

from django.db.models import Q



class notification_list(generics.ListAPIView):
    serializer_class = notifications_serializer
    queryset = user_notification.objects.filter()
    lookup_field = ['user', 'creator']
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self, *args, **kwargs):
        try:
            qs = user_notification.objects.filter(Q(user = self.request.user) | 
                                                  Q(creator = self.request.user)).select_related('user', 'creator')
        except:
            qs = user_notification.objects.none()
        return qs

