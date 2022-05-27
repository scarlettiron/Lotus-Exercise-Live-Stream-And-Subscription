from django.db import models
from django.db.models import Q
from content.models import album

from subscription.models import subscription

from users.models import customerId

from follow.models import follow

from django.conf import settings
User = settings.AUTH_USER_MODEL



class post_querysets(models.QuerySet):
    def search_all_content(self, query):
        lookup = Q(body__icontains = query, subscription = False)
        return self.filter(lookup).order_by('-date')
        
    def search_users_posts(self, query, user):
        lookup = Q(body__icontains = query, user=user)
        return self.filter(lookup).order_by('-date')
    
    def get_user_feed(self, user):
        following = user.get_following().values_list('creator', flat=True)
        subscribed = user.get_subscriptions().values_list('creator', flat=True)
        lookup = Q(user__id__in=following, subscription=False) | Q(user__id__in=subscribed)
        posts = self.filter(lookup).distinct().order_by('-date')
        return posts
    
class post_manager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return post_querysets(self.model, using = self._db, hints=self._hints)
     
    # searches through all posts that are not included in a subscription #   
    def search_all_content(self, query):
        return self.get_queryset().search_content(query)
    
    #### FIX ME ### I need to return subscription posts if subscribed else only
    ### free posts
    # searches through all posts of certain users#
    def search_users_posts(self, query, user):
        return self.get_queryset().search_users_posts(query, user)
    

    def get_user_feed(self, user):
        return self.get_queryset().get_user_feed(self, user)

class post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    body = models.CharField(max_length=3000, blank=True, null=True)
    price_units = models.IntegerField(default = 0)
    like_count = models.IntegerField(default = 0)
    comment_count = models.IntegerField(default = 0)
    date = models.DateTimeField(auto_now_add=True)
    album = models.OneToOneField(album, on_delete=models.CASCADE, blank=True, null=True)
    subscription = models.BooleanField(default = False)

    
    objects = models.Manager()
    search = post_manager()
    
    @property
    def price(self):
        if self.price_units > 0:
            amount = self.price_units / 100
            return round(amount, 2)
        return self.price_units

    @property
    def url(self):
        return f"{settings.SITE_PROTOCOL}://{settings.SITE_NAME}/api/posts/{self.pk}"
        
        
    def __str__ (self):
        return f"{self.user} | {self.body}"


class postProductId(models.Model):
    st_productId = models.CharField(max_length=500)
    st_priceId = models.CharField(max_length=500)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    post = models.OneToOneField(post, primary_key=True, on_delete=models.CASCADE, related_name='productID')
    