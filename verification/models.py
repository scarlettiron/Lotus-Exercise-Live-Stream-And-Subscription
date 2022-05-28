from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL

class verificationStatus(models.Model):
    status = models.CharField(max_length=50)

class verification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photoId = models.ImageField(upload_to = 'verifications/photoId/')
    certificate = models.ImageField(upload_to = 'verifications/certificates/')
    status = models.ForeignKey(verificationStatus, on_delete=models.SET_NULL, null=True)
    reason = models.CharField(max_length=250)