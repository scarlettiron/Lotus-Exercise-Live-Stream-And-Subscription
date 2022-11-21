from django.db import models
from django.db.models import signals
from django.dispatch import receiver
''' from django.conf import settings
User = settings.AUTH_USER_MODEL '''
from users.models import custom_profile

class thread(models.Model):
    user1 = models.ForeignKey(custom_profile, related_name='+', on_delete=models.CASCADE)
    user2 = models.ForeignKey(custom_profile, related_name='+', on_delete=models.CASCADE)
    last_viewed = models.DateTimeField(auto_now=True)
    has_unread = models.BooleanField(default=True)
    
    
    class Meta:
        ordering = ['-last_viewed']
    
    def __str__(self):
        return f"obj_id:{self.pk} | user1: {self.user1.username} | user2: {self.user2.username}"

    def get_messages(self):
        return self.messages.all()
    


class message(models.Model):
    sender = models.ForeignKey(custom_profile, on_delete=models.CASCADE)
    body = models.CharField(max_length=1000, blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
    thread = models.ForeignKey(thread, on_delete=models.CASCADE, related_name="messages")
    is_call = models.BooleanField(default=False)
    answered = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-pk']


 
@receiver(signals.post_save, sender=message)
def update_thread(sender, instance, **kwargs):
    print('signal is saving')
    Thread = instance.thread
    Thread.has_unread = True
    Thread.save()