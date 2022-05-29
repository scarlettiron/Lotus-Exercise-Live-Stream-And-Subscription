from rest_framework import generics, mixins, parsers

from .models import verification
from .serializers import verification_serializer
from .mixins import verification_mixin

class verification_detail(verification_mixin, generics.CreateAPIView, 
                          mixins.RetrieveModelMixin):
    model = verification
    lookup_field = 'user'
    serializer_class = verification_serializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    
    def get_queryset(self, *args, **kwargs):
        user = self.kwargs['user']
        try:
            qs = verification.objects.filter(user = user).order_by('pk')[0]
            print(qs.status)
        except:
            qs = verification.objects.none()
        return qs
    
    
    
        
    
    
