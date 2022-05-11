from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL


class follow(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
