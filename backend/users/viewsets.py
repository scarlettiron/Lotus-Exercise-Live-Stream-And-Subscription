from rest_framework import viewsets, mixins
from .models import custom_profile
from .serializers import profile_serializer

class profileViewset(viewsets.ModelViewSet):
    queryset = custom_profile.objects.all()
    serializer_class = profile_serializer
    lookup_field = 'pk'
    
    def get(request, *args, **kwargs):
        pass
    
    
class profileViewsetGeneric( mixins.ListModelMixin, mixins.RetrieveModelMixin,
                            viewsets.GenericViewSet):
    
    queryset = custom_profile.objects.all()
    serializer = profile_serializer
    
    
profile_generic_viewset = profileViewsetGeneric.as_view({'get':'retreive'})
    
    