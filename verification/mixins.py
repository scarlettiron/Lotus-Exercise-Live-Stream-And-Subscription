from rest_framework.permissions import IsAuthenticated

class verification_mixin():
    permission_classes = [IsAuthenticated]