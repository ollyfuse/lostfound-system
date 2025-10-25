from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import (
    LostDocument, FoundDocument, 
    DocumentType, Payment, ContactAccess)
from .momo_service import MTNMoMoService
import uuid
from .serializers import (
    LostDocumentSerializer, FoundDocumentSerializer, 
    DocumentTypeSerializer, LostDocumentPublicSerializer,
    FoundDocumentPublicSerializer
    )

class DocumentTypeListView(generics.ListAPIView):
    queryset = DocumentType.objects.all()
    serializer_class = DocumentTypeSerializer

class LostDocumentCreateView(generics.ListCreateAPIView):
    queryset = LostDocument.objects.all().order_by('-created_at')
    serializer_class = LostDocumentSerializer

class FoundDocumentCreateView(generics.ListCreateAPIView):
    queryset = FoundDocument.objects.all().order_by('-created_at')
    serializer_class = FoundDocumentSerializer

class LostDocumentListView(generics.ListAPIView):
    serializer_class = LostDocumentPublicSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["document_type"]
    search_fields = ["Owner_name", "document_number"]

    def get_queryset(self):
        from django.utils import timezone
        from django.db.models import Case, When, BooleanField
        
        # Clean up expired premium documents first
        LostDocument.objects.filter(
            is_premium=True,
            premium_expires_at__lt=timezone.now()
        ).update(is_premium=False, premium_expires_at=None)
        
        # Return queryset with premium documents first
        return LostDocument.objects.filter(is_removed=False).annotate(
            is_active_premium=Case(
                When(
                    is_premium=True,
                    premium_expires_at__gt=timezone.now(),
                    then=True
                ),
                default=False,
                output_field=BooleanField()
            )
        ).order_by('-is_active_premium', '-created_at')

class FoundDocumentListView(generics.ListAPIView):
    queryset = FoundDocument.objects.all().order_by("-created_at")
    serializer_class = FoundDocumentPublicSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["document_type"]
    search_fields = ["found_name", "document_number"]

    def get_queryset(self):
        return FoundDocument.objects.filter(
            is_removed=False
        ).order_by("-created_at")

@method_decorator(csrf_exempt, name='dispatch')
class DocumentVerificationView(View):
    def post(self, request, document_type, document_id):
        try:
            data = json.loads(request.body)
            verification_input = data.get('verification_input', '').lower().strip()
            
            # Get the document based on type
            if document_type == 'found':
                document = FoundDocument.objects.get(id=document_id)
                owner_name = document.found_name.lower() if document.found_name else ''
                serializer = FoundDocumentSerializer(document, context={'request': request})
            else:  # lost
                document = LostDocument.objects.get(id=document_id)
                owner_name = document.Owner_name.lower() if document.Owner_name else ''
                serializer = LostDocumentSerializer(document, context={'request': request})
            
            doc_number = document.document_number.lower() if document.document_number else ''
            
            # Check if input matches real data
            if verification_input == owner_name or verification_input == doc_number:
                return JsonResponse({
                    'verified': True,
                    'document': serializer.data
                })
            else:
                return JsonResponse({'verified': False})
                
        except (LostDocument.DoesNotExist, FoundDocument.DoesNotExist):
            return JsonResponse({'error': 'Document not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


class DocumentStatsView(View):
    def get(self, request):
        try:
            # Count total documents
            total_lost = LostDocument.objects.count()
            total_found = FoundDocument.objects.count()
            
            # Count potential matches (same logic as tasks.py)
            matched_count = 0
            
            # Check each found document for matches
            for found_doc in FoundDocument.objects.all():
                if found_doc.found_name and found_doc.document_number:
                    matches = LostDocument.objects.filter(
                        document_type=found_doc.document_type,
                        Owner_name__iexact=found_doc.found_name.strip(),
                        document_number__iexact=found_doc.document_number.strip()
                    ).exclude(document_number__isnull=True).exclude(document_number='')
                    
                    if matches.exists():
                        matched_count += matches.count()
            
            return JsonResponse({
                'total_lost': total_lost,
                'total_found': total_found,
                'total_matched': matched_count,
                'success_rate': round((matched_count / max(total_lost, 1)) * 100, 1)
            })
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


# payment view

@api_view(['POST'])
def request_payment(request):
    """Request payment for contact access"""
    try:
        phone_number = request.data.get('phone_number')
        report_type = request.data.get('report_type')  
        report_id = request.data.get('report_id')
        user_email = request.data.get('user_email')
        
        if not all([phone_number, report_type, report_id, user_email]):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        reference_id = str(uuid.uuid4())
        payment = Payment.objects.create(
            momo_reference_id=reference_id,
            phone_number=phone_number,
            amount=2000,  # 2000 RWF
            currency='EUR'
        )

        
        # Request payment from MTN MoMo
        momo_service = MTNMoMoService()
        result = momo_service.request_payment(phone_number, 2000, reference_id)
        
        if result['success']:
            ContactAccess.objects.create(
                payment=payment,
                report_type=report_type,
                report_id=report_id,
                user_email=user_email
            )
            
            return Response({
                'success': True,
                'payment_id': str(payment.id),
                'message': 'Payment request sent. Check your phone for MoMo prompt.'
            })
        else:
            payment.status = 'FAILED'
            payment.save()
            return Response({'error': result['error']}, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def check_payment_status(request, payment_id):
    """Check if payment is completed"""
    try:
        payment = Payment.objects.get(id=payment_id)
        
        if payment.status == 'SUCCESSFUL':
            return Response({'status': 'SUCCESSFUL', 'paid': True})
        
        # Check with MTN MoMo
        momo_service = MTNMoMoService()
        result = momo_service.check_payment_status(payment.momo_reference_id)
        
        if result['success']:
            if result['status'] == 'SUCCESSFUL':
                payment.status = 'SUCCESSFUL'
                payment.save()
                return Response({'status': 'SUCCESSFUL', 'paid': True})
            elif result['status'] == 'FAILED':
                payment.status = 'FAILED'
                payment.save()
                return Response({'status': 'FAILED', 'paid': False})
            else:
                return Response({'status': 'PENDING', 'paid': False})
        else:
            return Response({'error': result['error']}, status=status.HTTP_400_BAD_REQUEST)
            
    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def upgrade_to_premium(request):
    """ Upgrade lost document to premium listing """
    try:
        # Get request data
        lost_doc_id = request.data.get('lost_doc_id')
        verification_input = request.data.get('verification_input', '').strip()
        phone_number = request.data.get('phone_number')

        if not all([lost_doc_id, verification_input, phone_number]):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the lost document
        try:
            lost_doc = LostDocument.objects.get(id=lost_doc_id)
        except LostDocument.DoesNotExist:
            return Response({'error': 'Lost document not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Verify ownership (owner name or document number)
        owner_name = lost_doc.Owner_name.lower().strip()
        doc_number = (lost_doc.document_number or '').lower().strip()
        input_lower = verification_input.lower().strip()

        if input_lower != owner_name and input_lower != doc_number:
            return Response({'error': 'Verification failed'}, status=status.HTTP_403_FORBIDDEN)
        
        #  Check if already premium and not expired
        from django.utils import timezone
        if lost_doc.is_premium and lost_doc.premium_expires_at and lost_doc.premium_expires_at > timezone.now():
            return Response({'error': 'Document is already premium'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Payment record for premium upgrade
        reference_id = str(uuid.uuid4())
        payment = Payment.objects.create(
            momo_reference_id=reference_id,
            phone_number=phone_number,
            amount=500,
            currency='EUR'
        )

        # Requesting payment from MTN MoMo
        momo_service = MTNMoMoService()
        result = momo_service.request_payment(phone_number, 500, reference_id)

        if result['success']:
            #  Store the payment reference in the document
            lost_doc.premium_payment = payment
            lost_doc.save()

            return Response({
                'success': True,
                'payment_id': str(payment.id),
                'message': 'Premium upgrade payment sent. check your phone for MoMo prompt.'
            })
        else:
            payment.status = 'FAILED'
            payment.save()
            return Response({'error': result['error']}, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def check_premium_payment(request,payment_id):
    """ Check premium payment status and activate premium if successful """
    try:
        payment = Payment.objects.get(id=payment_id)

        if payment.status == 'SUCCESSFUL':
            return Response({'status': 'SUCCESSFUL', 'paid': True})
        
        # check with MTN MoMo
        momo_service = MTNMoMoService()
        result = momo_service.check_payment_status(payment.momo_reference_id)

        if result['success'] and result['status'] == 'SUCCESSFUL':
            payment.status = 'SUCCESSFUL'
            payment.save()

            # Activate premium for the document
            lost_doc = payment.premium_lost_documents.first()
            if lost_doc:
                from django.utils import timezone
                from datetime import timedelta

                lost_doc.is_premium = True
                lost_doc.premium_expires_at = timezone.now() + timedelta(days=7)
                lost_doc.save()

            return Response({'status': 'SUCCESSFUL', 'paid': True})
        else:
            return Response({'status': 'PENDING', 'paid': False})
        
    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def request_document_removal(request, document_type, document_id):
    """ Request document removal with verification """
    try:
        verification_input = request.data.get('verification_input', '').strip().lower()
        reason = request.data.get('reason', 'FOUND')

        # Get document
        if document_type == 'lost':
            document = LostDocument.objects.get(id=document_id, is_removed=False)
            owner_name = document.Owner_name.lower()
        else:  
            document = FoundDocument.objects.get(id=document_id, is_removed=False)
            owner_name = (document.found_name or '').lower()

        doc_number = (document.document_number or '').lower()

        # Ownership verification
        if verification_input not in [owner_name, doc_number]:
            return Response({'error': 'Verification failed'}, status=403)
        
        # Generate removal token
        from django.utils import timezone
        from datetime import timedelta

        removal_token = str(uuid.uuid4())
        document.removal_token = removal_token
        document.removal_reason = reason
        document.removal_token_expires = timezone.now() + timedelta(hours=24)
        document.save()

        # Send removal email
        from core.tasks import send_removal_email
        send_removal_email.delay(document_type, document_id, removal_token)

        return Response({
            'success': True,
            'message': 'Removal email sent. Check your inbox to confirm.'
        })
    except (LostDocument.DoesNotExist, FoundDocument.DoesNotExist):
        return Response({'error': 'Document not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

        
@api_view(['GET'])
def confirm_document_removal(request):
    """Confirm document removal via email link"""
    try:
        token = request.GET.get('token')
        if not token:
            return Response({'error': 'Missing removal token'}, status=400)
        from django.utils import timezone

        # find document with this token
        document = None
        document_type = None

        # Check lost documents
        try:
            document = LostDocument.objects.get(
                removal_token=token,
                removal_token_expires__gt=timezone.now(),
                is_removed=False
            )
            document_type = 'lost'
        except LostDocument.DoesNotExist:
            pass

        # Check found documents
        if not document:
            try:
                document = FoundDocument.objects.get(
                    removal_token=token,
                    removal_token_expires__gt=timezone.now(),
                    is_removed=False
                )
                document_type = 'found'
            except FoundDocument.DoesNotExist:
                return Response({'error': 'Invalid or expired token'}, status=400)
            
        # Mark document as removed
        document.is_removed = True
        document.removed_at = timezone.now()
        document.removal_token = None
        document.removal_token_expires = None
        document.save() 

        return Response({
            'success': True,
            'message': f'Document successful removed from listings',
            'document_type': document_type,
            'document_id': document.document_type.name
        }) 
    
    except Exception as e:
        return Response({'error': str(e)}, status=400)
