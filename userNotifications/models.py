from django.db import models

from django.conf import settings
User = settings.AUTH_USER_MODEL



notification_types = [
    ('verification passed', 'Verification Passed'),
    ('verification failed', 'Verification Failed'),
    ('purchase refund', 'Purchase Refund'),
    ('subscription purchase', 'Subscription Purchase'),
    ('class purchase', 'Class Purchase'),
    ('post purchase', 'Post Purchase'),
    ('post like', 'Post Like'),
    ('post comment', 'Post Comment'),
    ('follw', 'Follow'),
    
]


class user_notification(models.Model):
    type = models.CharField(choices = notification_types, max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='+')
    creator = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='+')
    seen = models.BooleanField(default=False)

