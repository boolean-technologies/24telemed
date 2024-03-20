from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

@database_sync_to_async
def get_user_from_token(token):
    try:
        # Decode the token
        access_token = AccessToken(token)
        # Get the user ID from the token's payload
        user_id = access_token['userId']
        # Fetch the user from the database
        user = get_user_model().objects.get(id=user_id)
        return user
    except Exception as e:
        # Handle exceptions or invalid token cases
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Extract token from query string
        query_string = parse_qs(scope["query_string"].decode("utf8"))
        token = query_string.get("token", [None])[0]
        if token:
            scope['user'] = await get_user_from_token(token)
        else:
            scope['user'] = AnonymousUser()
        return await super().__call__(scope, receive, send)

def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))
