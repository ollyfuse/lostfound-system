from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import LostDocument, FoundDocument, DocumentType
from .serializers import (
    LostDocumentSerializer, FoundDocumentSerializer, 
    DocumentTypeSerializer, LostDocumentPublicSerializer,
    FoundDocumentPublicSerializer
    )

class DocumentTypeListView(generics.ListAPIView):
    queryset = DocumentType.objects.all()
    serializer_class = DocumentTypeSerializer

class LostDocumentCreateView(generics.ListCreateAPIView):
    queryset = LostDocument.objects.all().order_by('-created_at')
    serializer_class = LostDocumentSerializer

class FoundDocumentCreateView(generics.ListCreateAPIView):
    queryset = FoundDocument.objects.all().order_by('-created_at')
    serializer_class = FoundDocumentSerializer

class LostDocumentListView(generics.ListAPIView):
    queryset = LostDocument.objects.all().order_by("-created_at")
    serializer_class = LostDocumentPublicSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["document_type"]
    search_fields = ["Owner_name", "document_number"]

class FoundDocumentListView(generics.ListAPIView):
    queryset = FoundDocument.objects.all().order_by("-created_at")
    serializer_class = FoundDocumentPublicSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["document_type"]
    search_fields = ["found_name", "document_number"]