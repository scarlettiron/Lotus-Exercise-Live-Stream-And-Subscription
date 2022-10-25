''' from rest_framework import generics, mixins, parsers, response

from .models import Verification
from .serializers import verification_serializer
from .mixins import verification_mixin

class verification_detail(verification_mixin, generics.CreateAPIView, 
                          mixins.RetrieveModelMixin):
    model = Verification
    queryset = Verification.objects.get()
    lookup_field = 'user'
    serializer_class = verification_serializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    
    def get_queryset(self):
        user = self.kwargs['user']
        try:
            qs = Verification.objects.filter(user = user).order_by('pk')[0]
        except:
            qs = Verification.objects.none()
            
        return qs '''

        


