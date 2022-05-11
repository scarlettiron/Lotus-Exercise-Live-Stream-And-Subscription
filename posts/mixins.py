from .permissions import IsOwnerOrReadOnly
from rest_framework import permissions

class IsOwnerOrReadOnly_Mixin():
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
