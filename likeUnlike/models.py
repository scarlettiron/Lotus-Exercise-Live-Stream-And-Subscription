from django.db import models
from django.dispatch import receiver
from django.db.models import signals

from posts.models import post

from django.conf import settings
User = settings.AUTH_USER_MODEL

class post_like(models.Model):
    post = models.ForeignKey(post, on_delete=models.CASCADE, related_name='likedposts')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='usersliked')

    def __str__(self):
        return f"{self.post} | {self.user}"



@receiver(signals.post_save, sender = post_like)
def increase_like_count(sender, instance, **kwargs):
    Post = instance.post
    postLikeCount = Post.like_count + 1
    Post.like_count = postLikeCount
    Post.save()
    
@receiver(signals.pre_delete, sender=post_like)
def decrease_like_count(sender, instance, **kwargs):
    Post = instance.post
    postLikeCount = Post.like_count - 1
    Post.like_count = postLikeCount
    Post.save()
    