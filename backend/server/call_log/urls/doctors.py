from rest_framework.routers import DefaultRouter
from ..views import DoctorCallLogViewSet

router = DefaultRouter()
router.register(r'', DoctorCallLogViewSet, basename='doctor-calllog')

urlpatterns = router.urls
