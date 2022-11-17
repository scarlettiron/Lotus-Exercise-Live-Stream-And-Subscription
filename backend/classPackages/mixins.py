from .permissions import isPackageOwnerOrReadOnly
from rest_framework import permissions

class isPackageOwnerOrReadOnly_mixin():
    permission_classes = [permissions.IsAuthenticated, isPackageOwnerOrReadOnly]