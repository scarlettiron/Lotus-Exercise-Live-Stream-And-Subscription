from .permissions import VerifyIsAppointmentOwner
from rest_framework.permissions import IsAdminUser, IsAuthenticated

class AppointmentMixin():
    permission_classes = [IsAuthenticated, IsAdminUser, VerifyIsAppointmentOwner]