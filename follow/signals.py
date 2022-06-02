from django.db.models.signals import post_save
from django.dispatch import receiver
from.models import follow
from userNotifications.models import user_notification

@receiver(post_save, sender = follow)
def createFollowNotification(sender, instance, created, **kwargs):
    if created:
        user_notification.objects.create(type = 'follow',
                                         user = instance.follower,
                                         creator = instance.creator)