from django.db.models.signals import post_save
from django.dispatch import receiver
from.models import comment
from userNotifications.models import user_notification

@receiver(post_save, comment)
def createPostCommentNotification(sender, instance, created, **kwargs):
    if created:
        user_notification.objects.create(type = 'post comment', 
                                         user = instance.user)
        
@receiver(signal = post_save, sender = comment)
def increase_post_comment_count(sender, instance, created, **kargs):
    Post = instance.post
    updated_count = Post.comment_count + 1
    Post.comment_count = updated_count
    Post.save()