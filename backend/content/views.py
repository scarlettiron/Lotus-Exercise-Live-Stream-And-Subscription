from rest_framework import generics, parsers, response, permissions

from .models import album, media, supportedMediaContentTypes
from .mixins import Content_Mixin   
from .serializers import album_serializer, media_serializer



class get_user_albums(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = album.objects.filter()
    serializer_class = album_serializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    
    def get_queryset(self, *args, **kwargs):
        user_id = self.kwargs['user_id']
        qs = album.objects.filter(user = user_id)
        return qs
    
    def perform_create(self, request, *args, **kwargs):
        Album = album.objects.create(user = request.user)
        files = request.FILES.getlist('media', None)
        if files:
            supportedTypes = supportedMediaContentTypes.objects.all().values_list('type', flat=True)
            for file in files:
                if file.content_type in supportedTypes:
                    new_file = media(album = Album, media=file, media_type__type = file.content_type)
                    serializer = media_serializer(data=new_file)
                    if serializer.is_valid():
                        print("file valid")
                        serializer.save()
                else: return response.Response("Unsupported File Type", status=415)
        
        serializer = album_serializer(Album)
        return serializer.data





''' class album_detail(Content_Mixin, generics.RetrieveDestroyAPIView):
    queryset = album.objects.get()
    serializer_class = album_serializer
    lookup_Field = 'pk'

    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def perform_destroy(self, instance):
        super().perform_destroy(instance) '''
        
