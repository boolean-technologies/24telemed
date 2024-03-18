from rest_framework.routers import DefaultRouter
from ..views import DoctorCallLogViewSet

router = DefaultRouter()
router.register(r'', DoctorCallLogViewSet, basename='personnel-calllog')

urlpatterns = router.urls
