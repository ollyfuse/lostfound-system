from django.urls import path
from .views import start_claim, verify_claim, protected_image

urlpatterns = [
    path("claims/start/", start_claim, name="start_claim"),
    path("claims/verify/", verify_claim, name="verify_claim"),
    path("protected-image/", protected_image, name="protected_image"),
]
