import uuid
from django.db import models
from django.utils import timezone
from datetime import timedelta

class VerificationToken(models.Model):
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    report_type = models.CharField(max_length=10, choices=(("lost","lost"),("found","found")))
    report_id = models.PositiveIntegerField()
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=30, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=6)  # token valid 6 hours
        super().save(*args, **kwargs)

    def is_valid(self):
        return timezone.now() <= self.expires_at

    def __str__(self):
        return f"Token for {self.report_type} #{self.report_id}"
