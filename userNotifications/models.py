from django.db import models

from django.conf import settings
User = settings.AUTH_USER_MODEL



notification_types = [
    ('passed verification', 'Verification Passed'),
    ('failed verification', 'Verification Failed'),
    ('refund', 'Purchase Refund'),
    ('purchase subscription', 'Subscription Purchase'),
    ('purchase class', 'Class Purchase'),
    ('purchase post', 'Post Purchase'),
    ('like post', 'Post Like'),
    ('comment post', 'Post Comment'),
    ('follow', 'Follow'),
    
]


class user_notification(models.Model):
    type = models.CharField(choices = notification_types, max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='+')
    creator = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='+')
    seen = models.BooleanField(default=False)

