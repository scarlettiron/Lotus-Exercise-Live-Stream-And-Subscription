from django.db import models
from django.dispatch import receiver
from django.db.models import signals

from posts.models import post

from django.conf import settings
User = settings.AUTH_USER_MODEL

class post_like(models.Model):
    post = models.ForeignKey(post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='usersliked')

    def __str__(self):
        return f"{self.post.pk} | {self.user.pk}"




    