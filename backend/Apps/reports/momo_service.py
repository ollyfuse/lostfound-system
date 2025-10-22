import requests
import uuid
import base64
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class MTNMoMoService:
    def __init__(self):
        self.base_url = "https://sandbox.momodeveloper.mtn.com"
        self.api_user = getattr(settings, 'MTN_API_USER', '')
        self.api_key = getattr(settings, 'MTN_API_KEY', '')
        self.subscription_key = getattr(settings, 'MTN_SUBSCRIPTION_KEY', '')
        
    def get_access_token(self):
        """Get access token for MTN MoMo API"""
        url = f"{self.base_url}/collection/token/"

        # Debug logging
        logger.info(f"API User: {self.api_user}")
        logger.info(f"API Key: {self.api_key[:8]}...")  # Only show first 8 chars
        logger.info(f"Subscription Key: {self.subscription_key[:8]}...")

        
        # Create basic auth header
        credentials = f"{self.api_user}:{self.api_key}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        headers = {
            'Authorization': f'Basic {encoded_credentials}',
            'Ocp-Apim-Subscription-Key': self.subscription_key,
            'X-Target-Environment': 'sandbox',
            'Content-Length': '0',
        }
        
        try:
            response = requests.post(url, headers=headers)
            response.raise_for_status()
            return response.json().get('access_token')
        except Exception as e:
            logger.error(f"Failed to get access token: {e}")
            return None
    
    def request_payment(self, phone_number, amount, reference_id):
        """Request payment from user"""
        logger.info(f"Starting payment request for {phone_number}, amount: {amount}")
        
        access_token = self.get_access_token()
        if not access_token:
            return {'success': False, 'error': 'Failed to get access token'}
        
        logger.info(f"Got access token: {access_token[:20]}...")
        
        url = f"{self.base_url}/collection/v1_0/requesttopay"
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'X-Reference-Id': reference_id,
            'X-Target-Environment': 'sandbox',
            'Ocp-Apim-Subscription-Key': self.subscription_key,
            'Content-Type': 'application/json',
        }
        
        payload = {
            'amount': str(amount),
            'currency': 'EUR',
            'externalId': str(uuid.uuid4()),
            'payer': {
                'partyIdType': 'MSISDN',
                'partyId': phone_number
            },
            'payerMessage': 'Payment for document contact access',
            'payeeNote': 'DocuFind contact access fee'
        }
        
        logger.info(f"Payment payload: {payload}")
        logger.info(f"Request headers: {headers}")
        
        try:
            response = requests.post(url, json=payload, headers=headers)
            logger.info(f"Payment response status: {response.status_code}")
            logger.info(f"Payment response text: {response.text}")
            
            if response.status_code == 202:
                return {'success': True, 'reference_id': reference_id}
            else:
                return {'success': False, 'error': f'Payment request failed: {response.text}'}
        except Exception as e:
            logger.error(f"Payment request failed: {e}")
            return {'success': False, 'error': str(e)}
        
    def check_payment_status(self, reference_id):
        """Check payment status"""
        access_token = self.get_access_token()
        if not access_token:
            return {'success': False, 'error': 'Failed to get access token'}
        
        url = f"{self.base_url}/collection/v1_0/requesttopay/{reference_id}"
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'X-Target-Environment': 'sandbox',
            'Ocp-Apim-Subscription-Key': self.subscription_key,
        }
        
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            return {
                'success': True,
                'status': data.get('status'),
                'transaction_id': data.get('financialTransactionId')
            }
        except Exception as e:
            logger.error(f"Status check failed: {e}")
            return {'success': False, 'error': str(e)}
