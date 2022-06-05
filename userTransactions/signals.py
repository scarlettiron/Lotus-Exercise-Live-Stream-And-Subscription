from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserTransactionItem
from userNotifications.models import user_notification

@receiver(post_save, sender = UserTransactionItem)
def adjustCreatorBalance(sender, instance, created, **kwargs):
    if created:
        if instance.is_payment:
            instance.user.balance.units += instance.units
            instance.user.balance.save()
        

@receiver(post_save, sender = UserTransactionItem)
def createNotification(sender, instance, created, **kwargs):
    if created and not instance.is_payment:
        type = None
        creator = None
        user = instance.user
        ''' #if instance is a payment then user is the creator
        if instance.is_payment:
            creator = instance.user '''
          
        if instance.subscription:
            type = 'subscription purchase'
            if not creator:
                creator = instance.subscription.creator
        if instance.post:
            type = 'post purchase'
            if not creator:
                creator = instance.post.user
        if instance.classPackage:
            type = 'class purchase'
            if not creator:
                creator = instance.classPackage.user
        
        #unfinished
        if instance.is_refund:
            type = 'refund'
        ##
            
        user_notification.objects.create(creator = creator, 
                                        user = user,
                                        type = type)