import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "yoga.settings")
django.setup()
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import chat.routing
import classPackages.routing
## for socket security limits the host allowed to access
from channels.security.websocket import AllowedHostsOriginValidator
## for socket sesions
from channels.sessions import SessionMiddlewareStack

get_django_application = get_asgi_application()

application = ProtocolTypeRouter({
  "http": get_django_application,
  "https": get_django_application,
  
  "websocket": AllowedHostsOriginValidator(AuthMiddlewareStack(SessionMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
  ))),
})


