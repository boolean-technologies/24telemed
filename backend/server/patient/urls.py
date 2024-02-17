from rest_framework.routers import DefaultRouter
from .views import PatientViewSet

router = DefaultRouter()
router.register(r'', PatientViewSet, basename='patient-record')

urlpatterns = router.urls