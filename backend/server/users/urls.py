from rest_framework.routers import DefaultRouter
from .views import UserViewSet, DoctorUserViewSet

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')
router.register(r'doctors', DoctorUserViewSet, basename='user-patient-record')

urlpatterns = router.urls