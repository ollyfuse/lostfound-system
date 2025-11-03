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

@api_view(['POST'])
def contact_us(request):
    """
    Handle contact form submissions
    """
    data = request.data
    
    # Validate required fields
    required_fields = ['name', 'email', 'category', 'subject', 'message']
    for field in required_fields:
        if not data.get(field):
            return Response({
                "detail": f"{field.replace('_', ' ').title()} is required."
            }, status=status.HTTP_400_BAD_REQUEST)
    
    # Basic email validation
    import re
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, data.get('email')):
        return Response({
            "detail": "Please provide a valid email address."
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get form data
        name = data.get('name')
        email = data.get('email')
        category = data.get('category')
        subject_text = data.get('subject')
        message = data.get('message')
        
        # Send email to support team
        subject = f"[DocuFind Contact] {category.title()}: {subject_text}"
        
        # Fix: Use regular string concatenation instead of f-string with backslashes
        message_html = message.replace('\n', '<br>')
        html_content = f"""
        <h3>New Contact Form Submission</h3>
        <p><strong>From:</strong> {name} ({email})</p>
        <p><strong>Category:</strong> {category.title()}</p>
        <p><strong>Subject:</strong> {subject_text}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            {message_html}
        </div>
        """
        
        # Create email
        email_obj = EmailMultiAlternatives(
            subject=subject,
            body=f"New contact form submission from {name} ({email})\n\n{message}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=['support@docufind.rw'],
            reply_to=[email]
        )
        email_obj.attach_alternative(html_content, "text/html")
        email_obj.send()
        
        # Send confirmation email to user
        confirmation_subject = "We received your message - DocuFind Support"
        confirmation_message_html = message.replace('\n', '<br>')
        confirmation_html = f"""
        <h3>Thank you for contacting DocuFind!</h3>
        <p>Hi {name},</p>
        <p>We've received your message and will get back to you within 24 hours during business days.</p>
        <p><strong>Your message:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            <strong>Subject:</strong> {subject_text}<br>
            <strong>Category:</strong> {category.title()}<br><br>
            {confirmation_message_html}
        </div>
        <p>Best regards,<br>DocuFind Support Team</p>
        """
        
        confirmation_email = EmailMultiAlternatives(
            subject=confirmation_subject,
            body=f"Hi {name},\n\nWe've received your message and will get back to you within 24 hours.\n\nBest regards,\nDocuFind Support Team",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email]
        )
        confirmation_email.attach_alternative(confirmation_html, "text/html")
        confirmation_email.send()
        
        return Response({
            "detail": "Message sent successfully! We'll get back to you within 24 hours."
        })
        
    except Exception as e:
        return Response({
            "detail": "Failed to send message. Please try again or contact us directly at support@docufind.rw"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)