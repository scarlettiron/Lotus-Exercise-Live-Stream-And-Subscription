from .permissions import VerifyIsThreadMember
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class MessagesMixin():
    permission_classes = [VerifyIsThreadMember]