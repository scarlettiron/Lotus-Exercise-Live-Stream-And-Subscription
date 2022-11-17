from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL


class notification_types(models.Model):
    type_option = models.CharField(max_length=100)
    
    def __str__ (self):
        return self.type_option


class notifications(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='+')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='+')
    type = models.ForeignKey(notification_types, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    
    @property
    def type_name(self):
        return self.type.type
    
    def __str__ (self):
        return f"{self.creator.username} | {self.user.username}"