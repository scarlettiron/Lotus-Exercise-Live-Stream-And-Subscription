from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import verification
from staffNotifications.models import staff_notification

### notes ###
#closeStaffTicket: figure out how to add description to model


#if verification status is set to passed, insure that staff ticket status is set to closed
@receiver(post_save, sender=verification)
def closeStaffTicket(sender, instance, created, **kwargs):
    if instance.status == 'passed' or instance.status == 'declined':
        staff_noti = staff_notification.objects.filter(user = instance.user, 
                                                       type = 'verification', 
                                                       status = 'open')
        staff_noti.status = 'closed'
        staff_noti.save()


# insure that user instructor status is set to true if they passed verification        
@receiver(post_save, sender = verification)
def updateUserVerificationStatus(sender, instance, created, **kwargs):
    if instance.status == 'passed':
        instance.user.is_instructor = True
        instance.user.save()
        
        
@receiver(post_save, sender = verification)
def createUserNotification(sender, instance, created, **kwargs):
    pass