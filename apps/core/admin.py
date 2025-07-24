from django.contrib import admin
from .models import UserContactInfo, DocumentType, LostDocument, FoundDocument, MatchNotification

admin.site.register(UserContactInfo)
admin.site.register(DocumentType)
admin.site.register(LostDocument)
admin.site.register(FoundDocument)
admin.site.register(MatchNotification)
