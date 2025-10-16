from django.urls import path
from .views import (
    DocumentTypeListView,
    LostDocumentCreateView,
    FoundDocumentCreateView,
    LostDocumentListView,
    FoundDocumentListView
)

urlpatterns = [
    path('lost/', LostDocumentCreateView.as_view(), name='lost'),
    path('found/', FoundDocumentCreateView.as_view(), name='found'),
    path('document-types/', DocumentTypeListView.as_view(), name='document-types'),

    path("lost/search/", LostDocumentListView.as_view(), name="lost-search"),
    path("found/search/", FoundDocumentListView.as_view(), name="found-search"),

]
