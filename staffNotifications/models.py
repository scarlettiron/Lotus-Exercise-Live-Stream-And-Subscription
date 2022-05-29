from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL



staffNotificationReasons = [
    ('verification', 'Verification'),
]

flags = [
    ('green', 'Green'),   
         ]

status_choices = [
    ('open', 'Open'),
    ('closed', 'Closed')
]

class staff_notification(models.Model):
    type = models.CharField(choices = staffNotificationReasons, max_length=50)
    flag = models.CharField(choices = flags, max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.CharField(max_length=3000, blank=True, null=True)
    status = models.CharField(choices = status_choices, max_length=20, default='open')
