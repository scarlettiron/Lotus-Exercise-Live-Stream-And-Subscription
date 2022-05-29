from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL

class verificationStatus(models.Model):
    status = models.CharField(max_length=50)
    
status_options = [
    ('pending', 'Pending'),
    ('declined', 'Declined'),
    ('passed', 'Passed')
]

class verification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photoId = models.ImageField(upload_to = 'verifications/photoId/')
    certificate = models.ImageField(upload_to = 'verifications/certificates/')
    status = models.CharField(choices = status_options, max_length=30, default = 'pending')
    reason = models.CharField(max_length=250)