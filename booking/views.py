
from rest_framework import generics, mixins
from rest_framework.response import Response

from .models import calendar, appointment, classSessionId
from .serializers import calendar_serializer, classSessionId_serializer

class calendar(generics.RetrieveAPIView):
    queryset = calendar.objects.all()
    serializer_class = calendar_serializer
    lookup_field = 'user'
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request,  *args, **kwargs)
    


class class_session_detail(generics.RetrieveUpdateAPIView):
    queryset = classSessionId.objects.filter().select_related('classPackage', 'classPackage__user')[0]
    lookup_field = 'pk'
    serializer_class = classSessionId_serializer
    
    def get_queryset(self):
        pk = self.kwargs['pk']
        return classSessionId.objects.filter(pk=pk).select_related('classPackage', 'classPackage__user')[0]

    def get(self, request, *args, **kwargs):
        qs = super().get_queryset()
        serializer = classSessionId_serializer(qs).data
        return Response(serializer, status=200)