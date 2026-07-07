from rest_framework.routers import DefaultRouter
from .views import UserViewSet, DoctorUserViewSet, PersonnelUserViewSet

router = DefaultRouter()
# Register the specific prefixes BEFORE the empty-prefix UserViewSet. Otherwise
# UserViewSet's detail route (^(?P<pk>[^/.]+)/$) shadows /users/doctors/ and
# /users/personnels/, treating "doctors"/"personnels" as a user pk → 404.
router.register(r'doctors', DoctorUserViewSet, basename='doctor-user-search')
router.register(r'personnels', PersonnelUserViewSet, basename='personnel-user-search')
router.register(r'', UserViewSet, basename='user')

urlpatterns = router.urls