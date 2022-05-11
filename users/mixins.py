from .permissions import IsCreatorOrReadOnly
from rest_framework.permissions import IsAdminUser, IsAuthenticated

class IsCreatorOrReadOnly_Mixin():
    permission_classes = [IsCreatorOrReadOnly] 