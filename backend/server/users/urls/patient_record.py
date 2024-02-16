from rest_framework.routers import DefaultRouter
from ..views import PatientRecordViewSet

router = DefaultRouter()
router.register(r'', PatientRecordViewSet, basename='patient_record')

urlpatterns = router.urls