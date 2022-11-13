from rest_framework import generics
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import UserTransactionItem
from .serializers import userTransaction_serializer, purchased_post_serializer
from .permissions import VerifyIsOwner
from django.db.models import Q


class user_transaction_list(generics.ListAPIView):
    model = UserTransactionItem
    serializer_class = userTransaction_serializer
    permission_classes = [VerifyIsOwner, IsAuthenticated, IsAdminUser]
    
    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        qs = UserTransactionItem.objects.filter(Q(user = user) 
            | Q(subscription__creator = user) 
            | Q(post__user = user)
            | Q(classPackage__user = user)
            ).select_related('user', 'subscription', 'post', 'classPackage')
        print(qs.count())
        return qs
    
    
class user_purchases_posts(generics.ListAPIView):
    permission_classes = [VerifyIsOwner, IsAuthenticated, IsAdminUser]
    model = UserTransactionItem
    serializer_class = userTransaction_serializer
    
    def get_queryset(self):
        user = self.request.user
        try:
            qs = UserTransactionItem.objects.filter(
                user = user, post__isnull = False).select_related(
                    'post', 'post__user', 'post__album')
            for q in qs:
                print(q.post)
        except:
            qs = UserTransactionItem.objects.none()
            
        return qs

