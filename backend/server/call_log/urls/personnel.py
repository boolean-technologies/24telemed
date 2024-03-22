from rest_framework.routers import DefaultRouter
from ..views import PersonnelCallLogViewSet

router = DefaultRouter()
router.register(r'', PersonnelCallLogViewSet, basename='personnel-calllog')

urlpatterns = router.urls
