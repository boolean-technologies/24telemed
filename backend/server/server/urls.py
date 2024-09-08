"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import routers, permissions
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import DoctorTokenObtainPairView, PersonnelTokenObtainPairView
from baton.autodiscover import admin


schema_view = get_schema_view(
   openapi.Info(
      title="24Telemed Telehealth Connect System API Documentation",
      default_version='v1',
      description="""
**Description:**
Welcome to the official API documentation for the 24Telemed Telehealth Connect system. This comprehensive guide provides detailed information about the various API endpoints, request/response formats, and functionalities available within our telemedicine platform.

Our system is designed to facilitate seamless communication between health care assistants and doctors, providing efficient and secure access to medical consultations and patient management. Through this documentation, developers and system integrators can understand how to interact with our system, integrate their services, and leverage the capabilities of the 24Telemed Connect system.

**Key Features:**
- **User Authentication**: Learn about the endpoints for user authentication, including login, logout, and session management for both health care assistants and doctors.
- **Patient Management**: Explore the APIs for managing patient profiles, medical histories, and dependent information.
- **Doctor Management**: Understand the endpoints for managing doctor profiles, availability, and call handling.
- **Call Management**: Discover how to initiate, manage, and log calls between health care assistants and doctors using our system.
- **Prescription Management**: Find out about the APIs for creating and managing prescriptions during medical consultations.
- **Security and Compliance**: Our APIs adhere to strict security standards and comply with healthcare regulations, ensuring data protection and privacy.

This documentation is structured to provide a clear and user-friendly guide to our API endpoints, complete with examples, request/response schemas, and error handling information. Whether you are a developer, a healthcare professional, or a system administrator, this documentation will assist you in effectively utilizing the 24Telemed Connect system to its full potential.
      """,
      terms_of_service="https://www.yourcompany.com/terms/",
      contact=openapi.Contact(email="contact@yourcompany.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

router = routers.DefaultRouter()

urlpatterns = [
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/doctor/', DoctorTokenObtainPairView.as_view(), name='token_obtain_pair_doctor'),
    path('auth/token/personnel/', PersonnelTokenObtainPairView.as_view(), name='token_obtain_pair_personnel'),
    path("admin/", admin.site.urls),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('call-logs/', include('call_log.urls.main')),
    path('users/', include('users.urls')),
    path('wallet/', include('wallet.urls')),
    
    path('patients/', include('patient.urls.patient')),
    path('doctors/medical-encounters/', include('medication.urls')),
    path('doctors/call-logs/', include('call_log.urls.doctors')),
    path('personnel/call-logs/', include('call_log.urls.personnel')),
    path('patient-access-logs/', include('patient.urls.access_log')),
    path('baton/', include('baton.urls')),
    path('admin_tools_stats/', include('admin_tools_stats.urls')),
]
