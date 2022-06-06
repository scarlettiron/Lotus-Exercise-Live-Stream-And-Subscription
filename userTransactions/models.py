from django.db import models
from subscription.models import subscription
from posts.models import post
from classPackages.models import publicPackage

from django.conf import settings
User = settings.AUTH_USER_MODEL

class UserTransactionItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    units = models.IntegerField()
    is_payment = models.BooleanField()
    is_purchase = models.BooleanField()
    is_refund = models.BooleanField()
    date = models.DateTimeField(auto_now_add=True)
    subscription = models.ForeignKey(subscription, on_delete=models.SET_NULL, null=True, blank=True)
    post = models.ForeignKey(post, on_delete=models.SET_NULL, null=True, blank=True)
    classPackage = models.ForeignKey(publicPackage, on_delete=models.SET_NULL, null=True, blank=True)

    @property
    def type(self):
        if self.subscription:
            return "subscription"
        if self.post:
            return "post"
        if self.classPackage:
            return "class"
        return "Unavailable" 
    
    @property
    def price(self):
        return self.units / 100
    
    class Meta:
        ordering = ['-date']
            
            

