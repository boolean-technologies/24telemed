from django.urls import path
from rest_framework.routers import DefaultRouter
from ..views import CallLogViewSet, WebhookAPIView

router = DefaultRouter()
router.register(r'', CallLogViewSet, basename='main-calllog')

urlpatterns = [
    path('video-sdk-webhook/', WebhookAPIView.as_view(), name='webhook'),
    *router.urls,
]
