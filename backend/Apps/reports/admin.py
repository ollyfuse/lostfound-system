from django.contrib import admin
from .models import DocumentType, UserContactInfo, LostDocument, FoundDocument

@admin.register(DocumentType)
class DocumentTypeAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(UserContactInfo)
class UserContactInfoAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone', 'email']
    search_fields = ['full_name', 'phone', 'email']

@admin.register(LostDocument)
class LostDocumentAdmin(admin.ModelAdmin):
    list_display = ['Owner_name', 'document_type', 'document_number', 'created_at']
    list_filter = ['document_type', 'created_at']
    search_fields = ['Owner_name', 'document_number']

@admin.register(FoundDocument)
class FoundDocumentAdmin(admin.ModelAdmin):
    list_display = ['found_name', 'document_type', 'document_number', 'created_at']
    list_filter = ['document_type', 'created_at']
    search_fields = ['found_name', 'document_number']
