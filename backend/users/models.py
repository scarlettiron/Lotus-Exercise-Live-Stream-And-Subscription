from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.db.models import Q, Prefetch
from django.utils.text import slugify
from tags.models import tag
from django.contrib.postgres.search import SearchQuery, SearchVector, SearchRank

from django.conf import settings
User = settings.AUTH_USER_MODEL



class creator_balance(models.Model):
    units = models.BigIntegerField()
    
    
    

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
    
    def search_instructors_complex(self, query_list, user=None):
        print(query_list)
        complex_query = SearchQuery(query_list[0])
        if len(query_list) > 0:
            for x in query_list[1:]:
                complex_query |= SearchQuery(x)
        
        Vector = SearchVector('username', weight = 'A') + SearchVector('tags__body', weight = 'B') + SearchVector('bio', weight = 'C')

        
        Rank = SearchRank(Vector, complex_query)
        
        users =  self.is_active().is_verified().is_instructor().annotate(
            rank = Rank
        ).filter(
            rank__gte = 0.03
        ).distinct().order_by('-rank')
        print(users[0].rank)
        
        
    
    def search_customers(self, query, user=None):
        lookup = Q(username__icontains = query) | Q(bio__icontains = query)
        return self.is_active().filter(lookup)
    

class profile_manager(UserManager):
    def get_queryset(self, *args, **kwargs):
        return profile_queryset(self.model, using=self._db, hints = self._hints)
    
    def search_instructors_complex(self, user=None, query_list = None):
        return self.get_queryset().search_instructors_complex(query_list, user=user)
    
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
    balance = models.OneToOneField(creator_balance, on_delete=models.SET_NULL, null = True)
    tags = models.ManyToManyField(tag, blank=True)
    
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
    # Id for stripe customer object
    customerId = models.CharField(max_length=500)
    customerEmail = models.EmailField()
    has_default_payment_method = models.BooleanField(default=False)
    payment_method_last_four = models.IntegerField(blank=True, null=True)

''' class tag(models.Model):
    name = models.CharField(max_length=100)
    used = models.IntegerField() '''

