
from rest_framework import generics, mixins
from rest_framework.response import Response

from .models import calendar, appointment, classSessionId
from .serializers import calendar_serializer, classSessionId_serializer, appointment_serializer

class calendar(generics.RetrieveAPIView):
    queryset = calendar.objects.all()
    serializer_class = calendar_serializer
    lookup_field = 'user'
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request,  *args, **kwargs)
    


class class_session_detail(generics.RetrieveUpdateAPIView):
    queryset = classSessionId.objects.filter().select_related('classPackage', 'classPackage__user')
    lookup_field = 'pk'
    serializer_class = classSessionId_serializer


class appointment_detail(generics.GenericAPIView):
    queryset = appointment.objects.filter().select_related('packageSessionId')
    lookup_field = 'user'
    serializer_class = appointment_serializer
    
    def put(self, request, *args, **kwargs):
        pass