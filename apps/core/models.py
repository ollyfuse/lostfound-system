from django.db import models
import datetime

# 1. Contact Info - used by both Lost and Found documents
class UserContactInfo(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.full_name


# 2. Document Type - standardizes types like ID, Passport, etc.
class DocumentType(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


# 3. Lost Document
class LostDocument(models.Model):
    contact_info = models.ForeignKey(UserContactInfo, on_delete=models.CASCADE, related_name="lost_documents")
    document_type = models.ForeignKey(DocumentType, on_delete=models.SET_NULL, null=True)
    document_number = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    reported_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.document_type} - {self.document_number} (Lost)"


# 4. Found Document
def upload_to(instance, filename):
    if instance.found_date:
        date_str = instance.found_date.strftime("%Y-%m-%d")
    else:
        # fallback to today's date
        date_str = datetime.date.today().strftime("%Y-%m-%d")
    return f"found_documents/{date_str}/{filename}"

class FoundDocument(models.Model):
    contact_info = models.ForeignKey(UserContactInfo, on_delete=models.CASCADE, related_name="found_documents")
    document_type = models.ForeignKey(DocumentType, on_delete=models.SET_NULL, null=True)
    name_on_document = models.CharField(max_length=100)
    document_number = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to=upload_to)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    found_date = models.DateField(blank=True, null=True)  # Add this field
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.document_type} - {self.name_on_document} (Found)"


# 5. Match Notification
class MatchNotification(models.Model):
    lost_document = models.ForeignKey(LostDocument, on_delete=models.CASCADE)
    found_document = models.ForeignKey(FoundDocument, on_delete=models.CASCADE)
    notified = models.BooleanField(default=False)
    notified_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Match: {self.lost_document} ↔ {self.found_document}"
