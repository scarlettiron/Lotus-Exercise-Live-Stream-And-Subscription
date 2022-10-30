from django.db import models
from django.db.models import Q, Prefetch, OuterRef, Count, Value
from django.contrib.postgres.search import SearchQuery, SearchVector, SearchRank, TrigramSimilarity
from content.models import album

from tags.models import tag

from django.conf import settings
User = settings.AUTH_USER_MODEL



class post_querysets(models.QuerySet):
    
    def search_all_content_complex(self, query_list, user=None):    
        complex_query = SearchQuery(query_list[0])
        trigram = TrigramSimilarity('body', query_list[0]) 
        if len(query_list) > 1:
            for x in query_list[1:]:
                complex_query |= SearchQuery(x)

                
        vector = SearchVector('body', weight='A') + SearchVector('tags__body', weight='B') 
        rank = SearchRank(vector, complex_query)

                #find rank and similarity for q, encase search and trigram doesn't find anything
                #use icontains
        if user:
            posts = self.annotate(rank = rank, similarity = trigram).filter(Q(rank__gte = .5) | 
                Q(similarity__gte = .01) | Q(body__icontains = query_list[0], subscription=False)
                ).annotate(
                    liked = Count('post_like', filter = Q(post_like__user__pk = user))
                #find if user has purchased the post
                ).annotate(
                    purchased = Count('usertransactionitem', filter = Q(usertransactionitem__user__pk = user))
                ).order_by("-rank",  "-similarity", "-date").select_related('user', 'album')
                
        else:
            posts = self.annotate(rank = rank, similarity = trigram).filter(Q(rank__gte = .5) | 
                Q(similarity__gte = .01) | Q(body__icontains = query_list[0], subscription=False)
                ).annotate(liked = Value(0), purchased = Value(0)).order_by(
                "-rank",  "-similarity", "-date").select_related('user', 'album')  
        
        return posts
    
        
    def search_users_posts(self, query, user):
        lookup = Q(body__icontains = query, user=user)
        return self.filter(lookup).order_by('-date')

    
    
    def get_user_feed(self, user):
        following = user.get_following().values_list('creator', flat=True)
        subscribed = user.get_subscriptions().values_list('creator', flat=True)
        lookup = Q(user__id__in=following, subscription=False) | Q(user__id__in=subscribed)
        posts = self.filter(lookup).annotate( liked = Count('post_like', filter = Q(post_like__user__pk = user.pk)),
                                            purchased = Count('usertransactionitem', filter = Q(usertransactionitem__user__pk = user.pk))
                                            ).distinct().select_related('user', 'album').order_by('-date')
        return posts





    
class post_manager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return post_querysets(self.model, using = self._db, hints=self._hints)





    

class post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    body = models.CharField(max_length=3000, blank=True, null=True)
    price_units = models.IntegerField(default = 0)
    like_count = models.IntegerField(default = 0)
    comment_count = models.IntegerField(default = 0)
    date = models.DateTimeField(auto_now_add=True)
    album = models.OneToOneField(album, on_delete=models.CASCADE, blank=True, null=True)
    subscription = models.BooleanField(default = False)
    tags = models.ManyToManyField(tag, blank=True)
    
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
    