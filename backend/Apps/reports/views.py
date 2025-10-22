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
    queryset = LostDocument.objects.all().order_by("-created_at")
    serializer_class = LostDocumentPublicSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["document_type"]
    search_fields = ["Owner_name", "document_number"]

class FoundDocumentListView(generics.ListAPIView):
    queryset = FoundDocument.objects.all().order_by("-created_at")
    serializer_class = FoundDocumentPublicSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["document_type"]
    search_fields = ["found_name", "document_number"]

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
        print(f"Request data: {request.data}")  # Debug log

        phone_number = request.data.get('phone_number')
        report_type = request.data.get('report_type')  
        report_id = request.data.get('report_id')
        user_email = request.data.get('user_email')

        print(f"Parsed data: phone={phone_number}, type={report_type}, id={report_id}, email={user_email}")  # Debug log
        
        if not all([phone_number, report_type, report_id, user_email]):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create payment record
        reference_id = str(uuid.uuid4())
        payment = Payment.objects.create(
            momo_reference_id=reference_id,
            phone_number=phone_number,
            amount=2000,  # 2000 RWF
            currency='EUR'
        )

        print(f"Created payment record: {payment.id}")  # Debug log
        
        # Request payment from MTN MoMo
        momo_service = MTNMoMoService()
        result = momo_service.request_payment(phone_number, 2000, reference_id)

        print(f"MoMo service result: {result}")  # Debug log
        
        if result['success']:
            # Store access info for later
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
        print(f"Exception in request_payment: {e}")  # Debug log
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