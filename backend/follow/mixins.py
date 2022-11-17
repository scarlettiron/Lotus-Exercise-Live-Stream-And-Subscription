from .permissions import isFollowerOrReadOnly
from rest_framework.permissions import IsAdminUser, IsAuthenticated

class Follow_Mixin():
    permission_classes = [IsAuthenticated, IsAdminUser, isFollowerOrReadOnly]