from django.urls import path
from . import views as v

urlpatterns = [
    path('all/', v.post_list.as_view(), name="post-all"),
    path('search/', v.post_search.as_view(), name='post-search'),
    path('feed/', v.post_feed.as_view(), name='post-feed'),
    path('list-create/<user>/', v.get_posts_exp.as_view(), name="exp"),
    path('detail/<pk>', v.post_detail_update_delete.as_view(), name='exp-detail'),
]