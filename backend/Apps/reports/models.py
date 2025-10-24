from django.db import models
from PIL import Image, ImageFilter
from io import BytesIO
from django.core.files.base import ContentFile
import uuid

def make_blurred_copy(image_file):
    image_file.seek(0)
    img = Image.open(image_file).convert("RGB")

    # blur the image moderately
    blurred_img = img.filter(ImageFilter.GaussianBlur(radius=25))
    
    output = BytesIO()
    blurred_img.save(output, format='JPEG', quality=85)
    return ContentFile(output.getvalue(), name=f"blurred_{image_file.name}")

class DocumentType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    

class UserContactInfo(models.Model):
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.full_name
    
class LostDocument(models.Model):
    Owner_name = models.CharField(max_length=100)
    document_type = models.ForeignKey(DocumentType, on_delete=models.CASCADE)
    document_number = models.CharField(max_length=100, blank=True, null=True)
    issue_date = models.DateField(blank=True, null=True)
    where_lost = models.CharField(max_length=200, blank=True, null=True)
    when_lost = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="lost_docs/", blank=True, null=True)
    contact = models.ForeignKey(UserContactInfo, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    is_premium = models.BooleanField(default=False)
    premium_expires_at = models.DateTimeField(blank=True, null=True)
    premium_payment = models.ForeignKey('Payment', null=True, blank=True, on_delete=models.SET_NULL, related_name='premium_lost_documents')

    def __str__(self):
        return f"{self.Owner_name} - {self.document_type.name}"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            from core.tasks import check_and_notify_matches
            check_and_notify_matches.delay(lost_doc_id=self.id) # type: ignore
    

class FoundDocument(models.Model):
    found_name = models.CharField(max_length=100, blank=True, null=True)
    document_type = models.ForeignKey(DocumentType, on_delete=models.CASCADE)
    document_number = models.CharField(max_length=100, blank= True, null=True)
    where_found = models.CharField(max_length=200, blank=True, null=True)
    when_found = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image_original = models.ImageField(upload_to="found_docs/")
    image_blurred = models.ImageField(upload_to="found_docs/blurred/", null=True, blank=True)
    contact = models.ForeignKey(UserContactInfo, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Found {self.document_type.name}"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        creating_blur = False
        
        if self.image_original and (not self.image_blurred or getattr(self.image_original, "file", None) is not None):
            creating_blur = True

        super().save(*args, **kwargs)  # Save original first
        
        if creating_blur:
            # Create blurred version
            storage = self.image_original.storage
            f = storage.open(self.image_original.name)
            blurred_file = make_blurred_copy(f)
            self.image_blurred.save(blurred_file.name, blurred_file, save=False)
            super().save(update_fields=["image_blurred"])
        
        if is_new:
            from core.tasks import check_and_notify_matches
            check_and_notify_matches.delay(found_doc_id=self.id) # type: ignore


# --------------------------------
# Payment Models
# --------------------------------

class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('SUCCESSFUL', 'Successful'),
        ('FAILED', 'Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    momo_reference_id = models.CharField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='RWF')
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.momo_reference_id} - {self.status}"
    
class ContactAccess(models.Model):
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE)
    report_type = models.CharField(max_length=10)
    report_id = models.IntegerField()
    user_email = models.EmailField()
    accessed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Access for {self.report_type} {self.report_id}"