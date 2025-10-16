from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.http import FileResponse
from reports.models import LostDocument, FoundDocument
from .models import VerificationToken
from .tasks import send_verification_email

@api_view(['POST'])
def start_claim(request):
    """
    Body: {
      "report_type": "lost" or "found",
      "report_id": 123,
      "contact_email": "me@example.com",
      "contact_phone": "2507xxxxxxx",
      "document_number": "12345"  # optional
    }
    """
    data = request.data
    report_type = data.get("report_type")
    report_id = data.get("report_id")
    contact_email = data.get("contact_email")
    contact_phone = data.get("contact_phone", "")

    # Basic validations
    if report_type not in ("lost", "found"):
        return Response({"detail": "Invalid report type."}, status=status.HTTP_400_BAD_REQUEST)

    report_model = LostDocument if report_type == "lost" else FoundDocument
    report = get_object_or_404(report_model, pk=report_id)

    # Optional document number validation
    provided_number = data.get("document_number")
    if provided_number and getattr(report, "document_number", None):
        if str(provided_number).strip().lower() != str(report.document_number).strip().lower():
            return Response({"detail": "Document number does not match our records."}, status=status.HTTP_403_FORBIDDEN)

    # Create token
    vt = VerificationToken.objects.create(
        report_type=report_type,
        report_id=report_id,
        contact_email=contact_email,
        contact_phone=contact_phone
    )

    # Send verification email via Celery
    send_verification_email.delay(vt.id)

    return Response({"detail": "Verification email sent. Please check your email."})

@api_view(['GET'])
def verify_claim(request):
    token = request.query_params.get("token")
    if not token:
        return Response({"detail": "Missing token"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        vt = VerificationToken.objects.get(token=token)
    except VerificationToken.DoesNotExist:
        return Response({"detail": "Invalid token"}, status=status.HTTP_404_NOT_FOUND)

    if not vt.is_valid():
        return Response({"detail": "Token expired."}, status=status.HTTP_410_GONE)

    # Fetch report
    report_model = LostDocument if vt.report_type == "lost" else FoundDocument
    report = get_object_or_404(report_model, pk=vt.report_id)

    # Return full serializer (unmasked)
    from reports.serializers import FoundDocumentSerializer, LostDocumentSerializer
    serializer = FoundDocumentSerializer(report, context={'request': request}) if vt.report_type == "found" else LostDocumentSerializer(report, context={'request': request})

    # Delete token to prevent reuse
    vt.delete()

    return Response(serializer.data)

@api_view(['GET'])
def protected_image(request):
    """
    GET params: ?report_type=found&report_id=123&token=<uuid>
    Returns: file response of image_original if token valid for that report
    """
    report_type = request.query_params.get("report_type")
    report_id = request.query_params.get("report_id")
    token = request.query_params.get("token")

    if not all([report_type, report_id, token]):
        return Response({"detail": "Missing params"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        vt = VerificationToken.objects.get(token=token, report_type=report_type, report_id=report_id)
    except VerificationToken.DoesNotExist:
        return Response({"detail": "Invalid token"}, status=status.HTTP_403_FORBIDDEN)

    if not vt.is_valid():
        return Response({"detail": "Token expired"}, status=status.HTTP_410_GONE)

    report_model = LostDocument if report_type == "lost" else FoundDocument
    report = get_object_or_404(report_model, pk=report_id)
    
    if not report.image_original:
        return Response({"detail": "No original image"}, status=status.HTTP_404_NOT_FOUND)

    return FileResponse(report.image_original.open("rb"), content_type="image/jpeg")
