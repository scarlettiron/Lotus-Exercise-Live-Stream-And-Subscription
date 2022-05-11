from distutils.command.upload import upload
from re import S
from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.conf import settings
from django.db.models import Q, signals
from django.utils.text import slugify
from django.dispatch import receiver

from subscription.models import subscription_product

User = settings.AUTH_USER_MODEL


class profile_queryset(models.QuerySet):
    def is_active(self):
        return self.filter(is_active = True)
    
    def is_verified(self):
        return self.filter(is_verified = True)
    
    def is_instructor(self):
        return self.filter(is_instructor = True)
    
    def search_instructors(self, query, user=None):
        lookup = Q(username__icontains = query) | Q(bio__icontains = query)
        return self.is_active().is_verified().is_instructor().filter(lookup).order_by('-last_login')
    
    def search_customers(self, query, user=None):
        lookup = Q(username__icontains = query) | Q(bio__icontains = query)
        return self.is_active().filter(lookup)
    

class profile_manager(UserManager):
    def get_queryset(self, *args, **kwargs):
        return profile_queryset(self.model, using=self._db, hints = self._hints)
    
    def search_instructors(self, query, user=None):
        return self.get_queryset().search_instructors(query, user=user)
    
    def search_customers(self, query, user=None):
        return self.get_queryset().search_customers(query, user=user)
    

class custom_profile(AbstractUser):
    bio = models.CharField(max_length=1000, blank=True)
    pic = models.ImageField(upload_to="profile-pictures/", blank=True)
    banner = models.ImageField(upload_to='profile-banners/', blank=True)
    is_instructor = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    subscription_units = models.IntegerField(default = 0)

    
    @property 
    def slug(self):
        return slugify(self.username)
    
    @property
    def subscription(self):
        if self.subscription_units > 0:
            amount = self.subscription_units / 100
            return round(amount, 2)
        return self.subscription_units
    
    @property
    def url(self):
        return f'to be editeds'
    
    search = profile_manager()
    
    def get_posts(self):
        return self.posts.order_by('-date')

    def get_following(self):
        ''' if creator:
            return self.following.filter(creator__pk = creator) '''
        return self.following.all() 
    
    def get_subscriptions(self):
        ''' if creator:
            return self.subscriptions.filter(creator__pk=creator ) '''
        return self.subscriptions.all()
    
    def get_subscribers(self):
        if self.is_instructor == True:
            return self.subscribers.all()



class customerId(models.Model):
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True)
    customerId = models.CharField(max_length=500)
    customerEmail = models.EmailField()

''' class tag(models.Model):
    name = models.CharField(max_length=100)
    used = models.IntegerField() '''
    
### signals for user ###

### check if profile picture is being changed
# if so, delete original from s3 bucket
''' @receiver(signals.pre_save, sender = custom_profile)
def profile_pic_update(sender, instance, *args, **kwargs):
    print("self: ")
    print(sender)
    print("instance: ")
    print(instance)
    print("args: ")
    print(args)
    print("kwargs: ")
    print(kwargs) '''
