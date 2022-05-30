from rest_framework import generics, mixins, parsers, response

from .models import verification
from .serializers import verification_serializer
from .mixins import verification_mixin

class verification_detail(verification_mixin, generics.CreateAPIView, 
                          mixins.RetrieveModelMixin):
    model = verification
    queryset = verification.objects.get()
    lookup_field = 'user'
    serializer_class = verification_serializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    
    def get(self, request, *args, **kwargs):
        user = self.kwargs['user']
        try:
            qs = verification.objects.filter(user = user).order_by('pk')[0]
            print(qs.status)
            serializer = verification_serializer(qs).data
            return response.Response(serializer, status=200)
        except:
            return response.Response(status = 404)


