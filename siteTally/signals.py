from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import siteTransaction
from userTransactions.models import UserTransactionItem

@receiver(post_save, sender=siteTransaction)
def create_user_transaction(self, instance, *args, **kwargs):
    try:
        UserTransactionItem.objects.create(
            user = instance.user.customerId,
            units = instance.units,
            is_payment = instance.is_payment,
            is_refund = instance.is_refund,
            subscription = instance.subscription,
            post = instance.post,
            classPackage = instance.classPackage,
        )
    except:
        print('error')
