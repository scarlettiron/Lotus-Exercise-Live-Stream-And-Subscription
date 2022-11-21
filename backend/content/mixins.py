from .permissions import isOwnerOrReadOnly_album
from rest_framework.permissions import IsAdminUser, IsAuthenticated

class Content_Mixin():
    permission_classes = [IsAuthenticated, isOwnerOrReadOnly_album]