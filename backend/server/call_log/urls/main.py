from rest_framework.routers import DefaultRouter
from ..views import CallLogViewSet

router = DefaultRouter()
router.register(r'', CallLogViewSet, basename='main-calllog')

urlpatterns = router.urls
