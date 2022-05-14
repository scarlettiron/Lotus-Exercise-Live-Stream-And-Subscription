from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL

class subscription(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscribers')
    subscriber = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    is_active = models.BooleanField(default=True)
    auto_draft = models.BooleanField(default=True)
    begin_date = models.DateTimeField()
    end_date = models.DateTimeField()
    st_subId = models.CharField(max_length=500)
    
    @property
    def price(self):
        return self.creator.subscription
    
    
    
class subscription_product(models.Model):
    st_productId = models.CharField(max_length=500)
    st_priceId = models.CharField(max_length=500)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)

