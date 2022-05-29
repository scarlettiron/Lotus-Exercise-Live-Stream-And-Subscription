from rest_framework import generics

from .models import verification
from .serializers import verification_serializer

class verification_detail(generics.RetrieveAPIView):
    model = verification
    lookup_field = ['user']
    serializer_class = verification_serializer
    
    def get_queryset(self, *args, **kwargs):
        user = self.kwargs['user']
        try:
            qs = verification.objects.filter(user = user).order_by('pk')[0]
        except:
            qs = verification.objects.none()
        print(qs.status)
        return qs
    
    
        
    
    
