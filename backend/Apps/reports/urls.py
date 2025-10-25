from django.urls import path
from .views import (
    DocumentTypeListView,
    LostDocumentCreateView,
    FoundDocumentCreateView,
    LostDocumentListView,
    FoundDocumentListView,
    DocumentVerificationView,
    DocumentStatsView,
    request_payment,
    check_payment_status,
    upgrade_to_premium,
    check_premium_payment,
    request_document_removal,
    confirm_document_removal,
)

urlpatterns = [
    path('lost/', LostDocumentCreateView.as_view(), name='lost'),
    path('found/', FoundDocumentCreateView.as_view(), name='found'),
    path('document-types/', DocumentTypeListView.as_view(), name='document-types'),

    path("lost/search/", LostDocumentListView.as_view(), name="lost-search"),
    path("found/search/", FoundDocumentListView.as_view(), name="found-search"),

    path('verify/<str:document_type>/<int:document_id>/', DocumentVerificationView.as_view(), name='document-verification'),

    path('stats/', DocumentStatsView.as_view(), name='document-stats'),
     # Payment URLs
    path('payment/request/', request_payment, name='request-payment'),
    path('payment/status/<uuid:payment_id>/', check_payment_status, name='check-payment-status'),
     # Premium URLs
    path('premium/upgrade/', upgrade_to_premium, name='upgrade-to-premium'),
    path('premium/status/<uuid:payment_id>/', check_premium_payment, name='check-premium-payment'),
     # Document removal URLs
    path('documents/<str:document_type>/<int:document_id>/request-removal/', request_document_removal, name='request_document_removal'),
    path('documents/confirm-removal/', confirm_document_removal, name='confirm_document_removal'),
]
