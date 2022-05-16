from django.urls import re_path

from . import consumers, private_call_consumers, combined_consumers
from classPackages.routing import websocket_urlpatterns as classUrlPatterns

websocket_urlpatterns = [
    re_path(r'ws/private-video-call/(?P<call_name>\w+)/$', private_call_consumers.PrivateCallConsumer.as_asgi()),
    re_path(r'ws/private_chat_call/(?P<room_name>\w+)/$',combined_consumers.combinedChatConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
] + classUrlPatterns