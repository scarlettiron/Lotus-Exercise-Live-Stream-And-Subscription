from signal import signal
from django.db import models
from posts.models import post
from django.conf import settings
User = settings.AUTH_USER_MODEL

from notifications.models import notification_types, notifications

from django.dispatch import receiver
from django.db.models import signals

class comment(models.Model):
    body = models.CharField(max_length=500)
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(post, on_delete=models.CASCADE)
    
    def __str__ (self):
        return f"{self.user.username} | {self.post.pk}"

''' @receiver(signal=signals.post_save, sender=comment)
def create_notification(sender, instance, *args, **kwargs):
    creator = instance.post.user
    user = instance.user
    noti_type = notification_types.objects.get(type_option='post/comment')
    notifications.objects.create(creator = creator, user=user, type=noti_type)
 '''
    
@receiver(signal = signals.post_save, sender = comment)
def increase_post_comment_count(sender, instance, *args, **kargs):
    Post = instance.post
    updated_count = Post.comment_count + 1
    Post.comment_count = updated_count
    Post.save()
