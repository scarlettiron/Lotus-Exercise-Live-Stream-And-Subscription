from rest_framework import generics, mixins
from .serializers import publicPackage_serializer
from .models import publicPackage
from .mixins import isPackageOwnerOrReadOnly_mixin

from booking.models import appointment

class publicPackage_list(generics.ListCreateAPIView,
                         mixins.UpdateModelMixin):
    queryset = publicPackage.objects.all().select_related('days_available', 'from_time', 'to_time')
    serializer_class = publicPackage_serializer
    
    def get_queryset(self, *args, **kwargs):
        username = self.kwargs['username']
        qs = publicPackage.objects.filter(user__username = username)
        return qs
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            return serializer.data



## get detail, update, delete
class publicPackage_detail(isPackageOwnerOrReadOnly_mixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = publicPackage.objects.all()
    serializer_class = publicPackage_serializer
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    def perform_destroy(self, instance):
        super().perform_destroy(instance)
        
        
