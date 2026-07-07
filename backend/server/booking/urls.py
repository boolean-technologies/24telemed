from rest_framework.routers import DefaultRouter

from .views import PersonnelBookingViewSet, DoctorBookingViewSet

router = DefaultRouter()
router.register(r'personnel', PersonnelBookingViewSet, basename='personnel-booking')
router.register(r'doctor', DoctorBookingViewSet, basename='doctor-booking')

urlpatterns = router.urls
