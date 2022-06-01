from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserTransactionItem
from userNotifications.models import user_notification

@receiver(post_save, sender = UserTransactionItem)
def adjustCreatorBalance(sender, instance, created, **kwargs):
    if created:
        if sender.is_payment:
            instance.user.balance.units += instance.units
            instance.user.balance.save()
        

@receiver(post_save, sender = UserTransactionItem)
def createNotification(sender, instance, created, **kwargs):
    if created:
        type = None
        if instance.subscription:
            type = 'subscription purchase'
        if instance.post:
            type = 'post purchase'
        if instance.classPackage:
            type = 'class purchase'
        if instance.is_refund:
            type = 'purchase refund'   
        user_notification.objects.create(creator = instance.creator, 
                                        user = instance.user,
                                        type = type)