from rest_framework import generics, mixins, permissions
from .models import UserTransactionItem
from .serializers import userTransaction_serializer
from django.db.models import Q

class user_transaction_list(generics.ListAPIView):
    model = UserTransactionItem
    serializer_class = userTransaction_serializer
    
    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        qs = UserTransactionItem.objects.filter(Q(user = user) 
            | Q(subscription__creator = user) 
            | Q(post__user = user)
            | Q(classPackage__user = user)
            ).select_related('user', 'subscription', 'post', 'classPackage')
        print(qs.count())
        return qs
