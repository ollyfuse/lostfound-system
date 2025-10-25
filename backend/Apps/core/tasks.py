from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from reports.models import LostDocument, FoundDocument

@shared_task
def send_verification_email(vt_id):
    from .models import VerificationToken
    vt = VerificationToken.objects.get(pk=vt_id)

    # Build verification URL (frontend route)
    verify_url = f"{settings.FRONTEND_URL}/verify?token={vt.token}"

    html_content = render_to_string("emails/claim_verification.html", {
        "verify_url": verify_url,
        "report_id": vt.report_id,
        "report_type": vt.report_type,
        "expires_hours": 6
    })

    msg = EmailMultiAlternatives(
        subject="Verify your claim for Lost & Found Report",
        body="Please verify your claim",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[vt.contact_email]
    )
    msg.attach_alternative(html_content, "text/html")
    msg.send(fail_silently=True)

@shared_task
def check_and_notify_matches(found_doc_id=None, lost_doc_id=None):
    """
    Runs in background to compare newly reported documents and
    email the lost owner if a perfect match (type + name + ID) is found.
    """
    
    if found_doc_id:
        try:
            found_doc = FoundDocument.objects.get(id=found_doc_id)
            # Look for matching lost documents
            possible_matches = LostDocument.objects.filter(
                document_type=found_doc.document_type,
                Owner_name__iexact=found_doc.found_name.strip() if found_doc.found_name else '',
                document_number__iexact=found_doc.document_number.strip() if found_doc.document_number else ''
            ).exclude(document_number__isnull=True).exclude(document_number='')
            
        except FoundDocument.DoesNotExist:
            return "Found document not found."
            
    elif lost_doc_id:
        try:
            lost_doc = LostDocument.objects.get(id=lost_doc_id)
            # Look for matching found documents
            possible_matches = FoundDocument.objects.filter(
                document_type=lost_doc.document_type,
                found_name__iexact=lost_doc.Owner_name.strip(),
                document_number__iexact=lost_doc.document_number.strip() if lost_doc.document_number else ''
            ).exclude(document_number__isnull=True).exclude(document_number='')
            
        except LostDocument.DoesNotExist:
            return "Lost document not found."
    else:
        return "No document ID provided."

    total_notified = 0

    for match in possible_matches:
        if found_doc_id:
            lost_doc = match
            current_found_doc = found_doc
        else:
            found_doc = match
            current_found_doc = found_doc
            lost_doc = lost_doc

        # Check if lost document owner has email
        if not lost_doc.contact.email:
            continue

        # Create verification token for this match
        from .models import VerificationToken
        vt = VerificationToken.objects.create(
            report_type="found",
            report_id=current_found_doc.id,
            contact_email=lost_doc.contact.email,
            contact_phone=""  # Not needed for automatic matches
        )
         # Build verification URL
        verification_link = f"{settings.FRONTEND_URL}/verify?token={vt.token}"

        # Render HTML template
        context = {
            "owner_name": lost_doc.Owner_name,
            "document_type": lost_doc.document_type.name,
            "document_number": lost_doc.document_number,
            "verification_link": verification_link,
        }
        
        subject = f"Good News: Your {context['document_type']} has been found!"
        html_content = render_to_string("emails/match_notification.html", context)

        try:
            msg = EmailMultiAlternatives(
                subject=subject,
                body="A matching document has been found.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[lost_doc.contact.email],
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send(fail_silently=False)
            total_notified += 1
        except Exception as e:
            print(f"Failed to send email: {e}")

    return f"{total_notified} notification(s) sent."


@shared_task
def send_removal_email(document_type, document_id, removal_token):
    """Send document removal confirmation email"""
    try:
        from reports.models import LostDocument, FoundDocument

        # Get document
        if document_type == "lost":
            document = LostDocument.objects.get(id=document_id)
            owner_name = document.Owner_name
        else:
            document = FoundDocument.objects.get(id=document_id)
            owner_name = document.found_name or "Document Owner"

        # Removal URL
        removal_url = f"{settings.FRONTEND_URL}/remove-document?token={removal_token}"

        # render email template
        context = {
            "owner_name": owner_name,
            "document_type": document.document_type.name,
            "document_number": document.document_number or "Not specified",
            "removal_url": removal_url,
            "reason": document.removal_reason or "FOUND"
        }
        html_content = render_to_string("emails/document_removal.html", context)

        subject = f"Confirm Removal of your {context['document_type']} listing"

        msg = EmailMultiAlternatives(
            subject=subject,
            body="Please confirm removal of your document listing.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[document.contact.email]
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)

        return f"Removal email sent to {document.contact.email}"
    
    except Exception as e:
        return f"Failed to send removal email: {e}"