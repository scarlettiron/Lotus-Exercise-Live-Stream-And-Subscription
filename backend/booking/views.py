
from rest_framework import generics, mixins
from rest_framework.response import Response

from .models import calendar, appointment, classSessionId
from .serializers import calendar_serializer, classSessionId_serializer, appointment_serializer
from .mixins import AppointmentMixin

class calendar(AppointmentMixin, generics.RetrieveAPIView):
    queryset = calendar.objects.all()
    serializer_class = calendar_serializer
    lookup_field = 'user'
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request,  *args, **kwargs)
    


class class_session_detail(generics.RetrieveUpdateAPIView):
    queryset = classSessionId.objects.filter().select_related('classPackage', 'classPackage__user')
    lookup_field = 'pk'
    serializer_class = classSessionId_serializer


class appointment_detail(AppointmentMixin, generics.GenericAPIView):
    queryset = appointment.objects.filter().select_related('packageSessionId')
    lookup_field = 'user'
    serializer_class = appointment_serializer
    
    def put(self, request, *args, **kwargs):
        pass
    
    
class appointment_list(AppointmentMixin, generics.ListAPIView):
    serializer_class = appointment_serializer
    def get_queryset(self):
        user = self.kwargs['user']
        qs  = appointment.objects.filter(user = user).select_related('packageSessionId', 
                                                'packageSessionId__classPackage',
                                                'packageSessionId__classPackage__user',
                                                'packageSessionId__classPackage__days_available')
        return qs