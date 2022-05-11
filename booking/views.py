from rest_framework import generics, mixins

from .models import calendar, appointment
from .serializers import calendar_serializer, classSessionId_serializer

class calendar(generics.RetrieveAPIView):
    queryset = calendar.objects.all()
    serializer_class = calendar_serializer
    lookup_field = 'user'
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request,  *args, **kwargs)
    



