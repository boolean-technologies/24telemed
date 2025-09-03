"""
ASGI config for server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
import ast
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")
django.setup()


from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import OriginValidator
from django.core.asgi import get_asgi_application
from django.urls import path
from call_log.consumer import CallLogWebSocketConsumer
from .jwt_auth_middleware import JWTAuthMiddlewareStack

asgi_application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": asgi_application,

    "websocket": OriginValidator(
        JWTAuthMiddlewareStack(
            URLRouter([
                path("video_call/", CallLogWebSocketConsumer.as_asgi()),
            ])
        ),
        ast.literal_eval(os.environ.get('ALLOWED_ORIGINS', '[]'))
    ),
})
