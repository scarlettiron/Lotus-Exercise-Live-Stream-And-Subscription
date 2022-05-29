from rest_framework import generics, mixins, parsers

from .models import verification
from .serializers import verification_serializer

class verification_detail(generics.RetrieveAPIView, mixins.CreateModelMixin):
    model = verification
    lookup_field = ['user']
    serializer_class = verification_serializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    
    def get_queryset(self, *args, **kwargs):
        user = self.kwargs['user']
        try:
            qs = verification.objects.filter(user = user).order_by('pk')[0]
        except:
            qs = verification.objects.none()
        print(qs.status)
        return qs
    
    def post(self, request, *args, **kwargs):
        
    
    
        
    
    
