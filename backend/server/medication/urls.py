from rest_framework.routers import DefaultRouter
from .views import DrugViewSet, DoctorPrescribedDrugViewSet, DoctorMedicalEncounterViewSet, PersonnelMedicalEncounterViewSet

router = DefaultRouter()
router.register(r'drugs', DrugViewSet, basename='drug')
router.register(r'personnel-medical-encounters', PersonnelMedicalEncounterViewSet, basename='personnel-medical-encounter')
router.register(r'doctor-medical-encounters', DoctorMedicalEncounterViewSet, basename='doctor-medical-encounter')
router.register(r'doctor-prescribed-drugs', DoctorPrescribedDrugViewSet, basename='doctor-prescribed-drug')

urlpatterns = router.urls