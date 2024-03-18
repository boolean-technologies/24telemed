from rest_framework.routers import DefaultRouter
from .views import UserViewSet, DoctorUserViewSet, PersonnelUserViewSet

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')
router.register(r'doctors', DoctorUserViewSet, basename='doctor-user-search')
router.register(r'personnels', PersonnelUserViewSet, basename='personnel-user-search')

urlpatterns = router.urls