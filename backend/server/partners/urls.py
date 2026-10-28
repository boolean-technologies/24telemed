from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import MyPartnerView, PartnerConsultationViewSet, PartnerDetailView, PartnerRegisterView

router = DefaultRouter()
router.register(r'consultations', PartnerConsultationViewSet, basename='partner-consultation')

# Fixed prefixes first so they aren't captured as a partner slug.
urlpatterns = [
    path('me/', MyPartnerView.as_view(), name='partner-me'),
    *router.urls,
    path('<slug:slug>/', PartnerDetailView.as_view(), name='partner-detail'),
    path('<slug:slug>/register/', PartnerRegisterView.as_view(), name='partner-register'),
]
