from django.contrib import admin
from .models import DocumentType, UserContactInfo, LostDocument, FoundDocument, Payment, ContactAccess

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
    list_display = ['Owner_name', 'document_type', 'document_number','contact', 'created_at']
    list_filter = ['document_type', 'created_at']
    search_fields = ['Owner_name', 'document_number']

@admin.register(FoundDocument)
class FoundDocumentAdmin(admin.ModelAdmin):
    list_display = ['found_name', 'document_type', 'document_number','contact', 'created_at']
    list_filter = ['document_type', 'created_at']
    search_fields = ['found_name', 'document_number']
@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id','momo_reference_id','phone_number', 'amount','currency', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['phone_number', 'id']

@admin.register(ContactAccess)
class ContactAccessAdmin(admin.ModelAdmin):
    list_display = ['payment', 'report_type', 'report_id', 'user_email', 'accessed_at']
    list_filter = ['report_type', 'accessed_at']
    search_fields = ['user_email', 'report_id']