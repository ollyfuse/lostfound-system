import { useState } from 'react';
import { X, Crown, Phone, CreditCard, CheckCircle, XCircle, Loader, Star } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function PremiumUpgradeModal({ isOpen, onClose, document, onSuccess }) {
  const [step, setStep] = useState('verification'); // verification, payment, processing, success, failed
  const [verificationInput, setVerificationInput] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentId, setPaymentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerificationAndPayment = async () => {
    if (!verificationInput.trim() || !phoneNumber.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('premium/upgrade/', {
        lost_doc_id: document.id,
        verification_input: verificationInput.trim(),
        phone_number: phoneNumber.trim()
      });

      if (response.data.success) {
        setPaymentId(response.data.payment_id);
        setStep('processing');
        // Start checking payment status
        checkPaymentStatus(response.data.payment_id);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Upgrade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (id) => {
    try {
      const response = await axiosClient.get(`premium/status/${id}/`);
      
      if (response.data.paid) {
        setStep('success');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else if (response.data.status === 'FAILED') {
        setStep('failed');
      } else {
        // Keep checking every 3 seconds
        setTimeout(() => checkPaymentStatus(id), 3000);
      }
    } catch (error) {
      setStep('failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Crown className="text-yellow-500" size={20} />
              <span>Upgrade to Premium</span>
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          {step === 'verification' && (
            <div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center space-x-2">
                  <Star className="text-yellow-600" size={16} />
                  <span>Premium Benefits</span>
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Top of search results for 7 days</li>
                  <li>• Premium badge visibility</li>
                  <li>• Email alerts to potential finders</li>
                  <li>• Higher chance of recovery</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Verify Ownership
                  </label>
                  <input
                    type="text"
                    value={verificationInput}
                    onChange={(e) => setVerificationInput(e.target.value)}
                    placeholder="Enter your name or document number"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the owner name or document number to verify ownership
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Phone size={16} className="inline mr-1" />
                    MTN MoMo Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="250788123456"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
                )}

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Premium Upgrade</span>
                    <span className="font-bold text-yellow-600">500 RWF</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">7-day premium listing</p>
                </div>

                <button
                  onClick={handleVerificationAndPayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition disabled:opacity-50 font-medium flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>Pay with MTN MoMo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader className="animate-spin mx-auto mb-4 text-yellow-600" size={48} />
              <h4 className="font-semibold mb-2">Processing Payment</h4>
              <p className="text-sm text-gray-600">
                Check your phone for the MTN MoMo prompt and approve the payment.
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
              <h4 className="font-semibold mb-2 text-green-600">Premium Activated!</h4>
              <p className="text-sm text-gray-600 mb-4">
                Your document is now premium for 7 days and will appear at the top of search results.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-700">
                  🎉 Your listing now has premium visibility!
                </p>
              </div>
            </div>
          )}

          {step === 'failed' && (
            <div className="text-center py-8">
              <XCircle className="mx-auto mb-4 text-red-600" size={48} />
              <h4 className="font-semibold mb-2 text-red-600">Payment Failed</h4>
              <p className="text-sm text-gray-600 mb-4">
                The payment could not be processed. Please try again.
              </p>
              <button
                onClick={() => {
                  setStep('verification');
                  setError('');
                  setVerificationInput('');
                  setPhoneNumber('');
                }}
                className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
