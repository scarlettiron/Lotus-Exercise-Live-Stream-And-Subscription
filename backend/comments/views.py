from rest_framework import generics, permissions
from .models import comment
from .serializers import create_comment_serializer

class comment_list_create(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = comment.objects.filter()
    serializer_class = create_comment_serializer
    
    def perform_create(self, serializer):
        return super().perform_create(serializer)

