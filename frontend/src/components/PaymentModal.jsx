import { useState } from 'react';
import { X, Phone, CreditCard, CheckCircle, XCircle, Loader } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function PaymentModal({ isOpen, onClose, documentData, onPaymentSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('input'); // input, pending, success, failed
  const [paymentId, setPaymentId] = useState(null);
  const [loading, setLoading] = useState(false);

const handlePayment = async () => {
  if (!phoneNumber) return;
  
  setLoading(true);
  setPaymentStatus('pending');
  
  try {
    const response = await axiosClient.post('payment/request/', {
      phone_number: phoneNumber,
      report_type: documentData.type,
      report_id: documentData.id,
      user_email: 'user@example.com' // You can get this from user input
    });
    
    if (response.data.success) {
      setPaymentId(response.data.payment_id);
      checkPaymentStatus(response.data.payment_id);
    } else {
      setPaymentStatus('failed');
    }
  } catch (error) {
    setPaymentStatus('failed');
  } finally {
    setLoading(false);
  }
};

const checkPaymentStatus = async (id) => {
  try {
    const response = await axiosClient.get(`payment/status/${id}/`);
    
    if (response.data.paid) {
      setPaymentStatus('success');
      onPaymentSuccess();
    } else if (response.data.status === 'FAILED') {
      setPaymentStatus('failed');
    } else {
      setTimeout(() => checkPaymentStatus(id), 3000);
    }
  } catch (error) {
    setPaymentStatus('failed');
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">💳 Payment Required</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {paymentStatus === 'input' && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Pay 2,000 RWF to access contact information and support our platform.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                <Phone size={16} className="inline mr-1" />
                MTN MoMo Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="250788123456"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handlePayment}
              disabled={!phoneNumber || loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? <Loader className="animate-spin mx-auto" size={20} /> : 'Pay with MTN MoMo'}
            </button>
          </div>
        )}

        {paymentStatus === 'pending' && (
          <div className="text-center">
            <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <h4 className="font-semibold mb-2">Payment Pending</h4>
            <p className="text-sm text-gray-600">
              Check your phone for the MTN MoMo prompt and approve the payment.
            </p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center">
            <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
            <h4 className="font-semibold mb-2 text-green-600">Payment Successful!</h4>
            <p className="text-sm text-gray-600 mb-4">
              Thank you for supporting our platform. Contact details are now available.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Continue
            </button>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="text-center">
            <XCircle className="mx-auto mb-4 text-red-600" size={48} />
            <h4 className="font-semibold mb-2 text-red-600">Payment Failed</h4>
            <p className="text-sm text-gray-600 mb-4">
              The payment could not be processed. Please try again.
            </p>
            <button
              onClick={() => setPaymentStatus('input')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
