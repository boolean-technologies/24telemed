from rest_framework.routers import DefaultRouter
from ..views import MedicalRecordViewSet

router = DefaultRouter()
router.register(r'', MedicalRecordViewSet, basename='medical_record')

urlpatterns = router.urls