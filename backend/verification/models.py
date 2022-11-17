from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL

''' class verificationStatus(models.Model):
    status = models.CharField(max_length=50) '''
    
status_options = [
    ('pending', 'Pending'),
    ('declined', 'Declined'),
    ('passed', 'Passed')
]

class Verification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photoId = models.ImageField(upload_to = 'verifications/photoId/')
    certificate = models.ImageField(upload_to = 'verifications/certificates/')
    status = models.CharField(choices = status_options, max_length=30, default = 'pending')
    reason = models.CharField(max_length=250, blank=True, null = True)
    





from django.db.models.signals import post_save
from django.dispatch import receiver
from staffNotifications.models import staff_notification

### notes ###
#closeStaffTicket: figure out how to add description to model

#create staff ticket when verification request is created
@receiver(post_save, sender = Verification)
def createrVerificationStaffTicker(sender, instance, created, **kwargs):
    print(created)
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
        
        
@receiver(post_save, sender = Verification)
def createUserNotification(sender, instance, created, **kwargs):
    pass