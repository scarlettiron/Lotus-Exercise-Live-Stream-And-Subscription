import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import chat.routing
## for socket security limits the host allowed to access
from channels.security.websocket import AllowedHostsOriginValidator
## for socket sesions
from channels.sessions import SessionMiddlewareStack

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "yoga.settings")

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "https": get_asgi_application(),
  
  "websocket": AllowedHostsOriginValidator(AuthMiddlewareStack(SessionMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
  ))),
})


