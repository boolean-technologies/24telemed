from rest_framework.routers import DefaultRouter
from ..views import PatientAccessLogViewSet

router = DefaultRouter()
router.register(r'', PatientAccessLogViewSet, basename='patient-access-logs')

urlpatterns = router.urls