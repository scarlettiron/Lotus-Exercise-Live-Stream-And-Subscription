from .permissions import isSubscriberOrReadOnly
from rest_framework.permissions import IsAdminUser, IsAuthenticated

class subscriptionMixin():
    permission_classes = [IsAuthenticated, isSubscriberOrReadOnly]