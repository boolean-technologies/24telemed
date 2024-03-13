from rest_framework.routers import DefaultRouter
from ..views import PersonnelCallLogViewSet, CallLogViewSet

router = DefaultRouter()
router.register(r'', PersonnelCallLogViewSet, basename='calllog')
router.register(r'main', CallLogViewSet, basename='main-calllog')

urlpatterns = router.urls
