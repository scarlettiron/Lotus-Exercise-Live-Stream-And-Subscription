from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from.models import post_like
from userNotifications.models import user_notification

@receiver(post_save, sender = post_like)
def createPostLikeNotifcation(sender, instance, created, **kwargs):
    if created:
        user_notification.objects.create(type = 'like post',
                                         user = instance.user,
                                         creator = instance.post.user
                                         )
        
        
        
@receiver(post_save, sender = post_like)
def increase_like_count(sender, instance, **kwargs):
    Post = instance.post
    postLikeCount = Post.like_count + 1
    Post.like_count = postLikeCount
    Post.save()
    
@receiver(pre_delete, sender=post_like)
def decrease_like_count(sender, instance, **kwargs):
    Post = instance.post
    postLikeCount = Post.like_count - 1
    Post.like_count = postLikeCount
    Post.save()