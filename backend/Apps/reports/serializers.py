from rest_framework import serializers
from .models import DocumentType, UserContactInfo, LostDocument, FoundDocument

def mask_string(s):
    if not s:
        return s
    s = str(s)
    if len(s) <= 4:
        return "****"
    return s[:2] + "*"*(len(s)-4) + s[-2:]

def mask_name(name):
    if not name:
        return None
    parts = name.split()
    if len(parts) == 1:
        return parts[0][0] + "*"*(max(len(parts[0])-2,0)) + (parts[0][-1] if len(parts[0])>1 else "")
    return parts[0][0] + "*"*(max(len(parts[0])-2,0)) + parts[0][-1] + " " + parts[-1][0] + "."

class UserContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserContactInfo
        fields = "__all__"

class DocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentType
        fields = "__all__"

# Public serializers (masked data)
class FoundDocumentPublicSerializer(serializers.ModelSerializer):
    document_number = serializers.SerializerMethodField()
    finder_name = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    document_type = DocumentTypeSerializer(read_only=True)

    class Meta:
        model = FoundDocument
        fields = ("id", "document_type", "finder_name", "document_number", "where_found", 
                 "when_found", "description", "created_at", "image")

    def get_document_number(self, obj):
        return mask_string(obj.document_number)

    def get_finder_name(self, obj):
        return mask_name(obj.found_name)

    def get_image(self, obj):
        if obj.image_blurred and obj.image_blurred.name:
            # Check if it's a malformed path
            if 'blurred_/app/' in obj.image_blurred.name:
                # Fall back to original image for malformed paths
                if obj.image_original:
                    return f"/.netlify/functions/media{obj.image_original.url}"
            else:
                # Use the blurred image for properly formatted paths
                return f"/.netlify/functions/media{obj.image_blurred.url}"
        elif obj.image_original:
            return f"/.netlify/functions/media{obj.image_original.url}"
        return None


class LostDocumentPublicSerializer(serializers.ModelSerializer):
    document_number = serializers.SerializerMethodField()
    owner_name = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    document_type = serializers.PrimaryKeyRelatedField(queryset=DocumentType.objects.all())
    is_premium = serializers.SerializerMethodField()
    premium_expires_at = serializers.SerializerMethodField()

    class Meta:
        model = LostDocument
        fields = ("id", "document_type", "owner_name", "document_number", "where_lost", 
                 "when_lost", "description", "image", "created_at", "is_premium", "premium_expires_at")

    def get_document_number(self, obj):
        return mask_string(obj.document_number)

    def get_owner_name(self, obj):
        return mask_name(obj.Owner_name)
    
    def get_image(self, obj):
        if obj.image:
            return f"/.netlify/functions/media{obj.image.url}"
        return None


    def get_is_premium(self, obj):
        """Check if document has active premium status"""
        from django.utils import timezone
        return (obj.is_premium and 
                obj.premium_expires_at and 
                obj.premium_expires_at > timezone.now())

    def get_premium_expires_at(self, obj):
        """Return premium expiry date if active"""
        from django.utils import timezone
        if (obj.is_premium and 
            obj.premium_expires_at and 
            obj.premium_expires_at > timezone.now()):
            return obj.premium_expires_at
        return None

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['document_type'] = DocumentTypeSerializer(instance.document_type).data
        return ret

    


# Full serializers (for verified users)
class LostDocumentSerializer(serializers.ModelSerializer):
    # Flat fields for FormData compatibility (same as FoundDocumentSerializer)
    contact_full_name = serializers.CharField(write_only=True)
    contact_phone = serializers.CharField(write_only=True)
    contact_email = serializers.EmailField(write_only=True, required=False, allow_blank=True)
    
    contact = UserContactInfoSerializer(read_only=True)
    document_type = serializers.PrimaryKeyRelatedField(queryset=DocumentType.objects.all())

    class Meta:
        model = LostDocument
        fields = "__all__"

    def create(self, validated_data):
        # Extract contact data from flat fields (same as FoundDocumentSerializer)
        contact_data = {
            'full_name': validated_data.pop('contact_full_name'),
            'phone': validated_data.pop('contact_phone'),
            'email': validated_data.pop('contact_email', ''),
        }
        
        contact, _ = UserContactInfo.objects.get_or_create(**contact_data)
        return LostDocument.objects.create(contact=contact, **validated_data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['document_type'] = DocumentTypeSerializer(instance.document_type).data
        return ret


class FoundDocumentSerializer(serializers.ModelSerializer):
    # Flat fields for FormData compatibility
    contact_full_name = serializers.CharField(write_only=True)
    contact_phone = serializers.CharField(write_only=True)
    contact_email = serializers.EmailField(write_only=True, required=False, allow_blank=True)
    
    image = serializers.ImageField(write_only=True, source='image_original')
    
    contact = UserContactInfoSerializer(read_only=True)
    document_type = serializers.PrimaryKeyRelatedField(queryset=DocumentType.objects.all())
    image_original = serializers.SerializerMethodField()

    class Meta:
        model = FoundDocument
        fields = "__all__"

    def get_image_original(self, obj):
        request = self.context.get("request")
        if obj.image_original:
            return f"/.netlify/functions/media{obj.image_original.url}"
        return None

    def create(self, validated_data):
        # Extract contact data from flat fields
        contact_data = {
            'full_name': validated_data.pop('contact_full_name'),
            'phone': validated_data.pop('contact_phone'),
            'email': validated_data.pop('contact_email', ''),
        }
        
        contact, _ = UserContactInfo.objects.get_or_create(**contact_data)
        return FoundDocument.objects.create(contact=contact, **validated_data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['document_type'] = DocumentTypeSerializer(instance.document_type).data
        return ret


