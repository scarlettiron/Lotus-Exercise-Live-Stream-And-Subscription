from django.urls import path
from . import views as v

urlpatterns = [
    path('all/', v.post_list.as_view(), name="post-all"),
    path('search-complex/', v.search_all_posts_complex.as_view(), name="search-posts-complex"),
    path('feed/', v.post_feed.as_view(), name='post-feed'),
    path('list-create/<user>/', v.get_posts_exp.as_view(), name="exp"),
    path('detail/<pk>', v.post_detail_update_delete.as_view(), name='exp-detail'),
]