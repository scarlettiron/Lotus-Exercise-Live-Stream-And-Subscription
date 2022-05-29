
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserTransactionItem


@receiver(post_save, sender = UserTransactionItem)
def adjustCreatorBalance(sender, instance, created, **kwargs):
    if sender.is_payment:
        instance.user.balance.units += instance.units
        instance.user.balance.save()
        

        
    