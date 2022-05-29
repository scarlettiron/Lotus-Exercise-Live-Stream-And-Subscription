from django.db import models

from django.conf import settings
User = settings.AUTH_USER_MODEL



notification_types = [
    ('verification', 'Verification')
]


class user_notification(models.Model):
    type = models.CharField(choices = notification_types, max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)
    

