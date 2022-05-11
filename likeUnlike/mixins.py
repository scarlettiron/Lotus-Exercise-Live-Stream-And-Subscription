from .permissions import isOwnerOrReadOnly
from rest_framework.permissions import IsAdminUser, IsAuthenticated

class IsOwnerOrReadOnly_Mixin():
    permission_classes = [IsAuthenticated, IsAdminUser, isOwnerOrReadOnly]