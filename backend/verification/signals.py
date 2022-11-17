from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Verification
from staffNotifications.models import staff_notification
from userNotifications.models import user_notification

### notes ###
#closeStaffTicket: figure out how to add description to model

#create staff ticket when verification request is created
@receiver(post_save, sender = Verification)
def createVerificationStaffTicket(sender, instance, created, **kwargs):
    if(created):
        staff_notification.objects.create(user = instance.user, 
                                          type = 'verification', flag = 'green',
                                          )

#if verification status is set to passed, insure that staff ticket status is set to closed
@receiver(post_save, sender=Verification)
def closeStaffTicket(sender, instance, created, **kwargs):
    if instance.status == 'passed' or instance.status == 'declined':
        staff_noti = staff_notification.objects.filter(user = instance.user, 
                                                       type = 'verification', 
                                                       status = 'open')
        staff_noti.status = 'closed'
        staff_noti.save()


# insure that user instructor status is set to true if they passed verification        
@receiver(post_save, sender = Verification)
def updateUserVerificationStatus(sender, instance, created, **kwargs):
    if instance.status == 'passed':
        instance.user.is_instructor = True
        instance.user.save()
        

#create user notification         
@receiver(post_save, sender = Verification)
def createUserNotification(sender, instance, created, **kwargs):
    if instance.status == 'passed':
        user_notification.objects.create(
            user = instance.user,
            type = 'pass verification'
        )
        
    if instance.status == 'declined':
         user_notification.objects.create(
            user = instance.user,
            type = 'fail verification'
        )       
        