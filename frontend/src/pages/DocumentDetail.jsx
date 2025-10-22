import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import axiosClient from '../api/axiosClient'; 
import { CheckCircle, Mail, Phone, MapPin, Calendar, Hash, Lock, CreditCard } from 'lucide-react';

export default function DocumentDetails() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [documentData, setDocumentData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [contactUnlocked, setContactUnlocked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      loadDocumentDetails();
    } else {
      setError('Invalid verification link');
      setLoading(false);
    }
  }, [token]);

  const loadDocumentDetails = async () => {
  try {
    const response = await axiosClient.get(`claims/verify/?token=${token}`);
    setDocumentData(response.data); // axiosClient automatically parses JSON
  } catch (error) {
    console.error('API Error:', error);
    setError(error.response?.data?.detail || 'Failed to load document details. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handlePaymentSuccess = () => {
    setContactUnlocked(true);
    setShowPaymentModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4 text-center">
          <div className="text-red-600 text-5xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <a 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  if (!documentData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-6 text-center">
            <CheckCircle className="mx-auto mb-2" size={48} />
            <h1 className="text-2xl font-bold">Document Found!</h1>
            <p className="text-green-100">Your document has been located</p>
          </div>

          {/* Document Image */}
          {documentData.image_original && (
            <div className="p-6 pb-0">
              <div className="relative">
                <img 
                  src={documentData.image_original} 
                  alt="Found Document" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  ✓ Original Image
                </div>
              </div>
            </div>
          )}

          {/* Document Details */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📄 {documentData.document_type?.name || 'Document'}
            </h2>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="flex items-center">
                <Hash className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <span className="font-medium text-gray-700">Document Number:</span>
                  <span className="ml-2 text-gray-600">{documentData.document_number || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <span className="font-medium text-gray-700">Found at:</span>
                  <span className="ml-2 text-gray-600">{documentData.where_found || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <span className="font-medium text-gray-700">Found on:</span>
                  <span className="ml-2 text-gray-600">{formatDate(documentData.when_found)}</span>
                </div>
              </div>

              {documentData.description && (
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="mt-1 text-gray-600">{documentData.description}</p>
                </div>
              )}
            </div>

            {/* Contact Information Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📞 Finder's Contact Information</h3>
              
              {!contactUnlocked ? (
                // Payment Gate for Contact Info
                <div className="bg-blue-50 border-2 border-dashed border-blue-200 p-6 rounded-lg text-center">
                  <Lock className="mx-auto mb-3 text-blue-600" size={32} />
                  <h4 className="font-semibold text-gray-800 mb-2">Contact Details Protected</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    To access the finder's contact information and support our platform, 
                    a small payment of <strong>2,000 RWF</strong> is required.
                  </p>
                  
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center space-x-2 mx-auto"
                  >
                    <CreditCard size={20} />
                    <span>Pay to Unlock Contact</span>
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-3">
                    Secure payment via MTN Mobile Money
                  </p>
                </div>
              ) : (
                // Unlocked Contact Information
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="text-green-600 mr-2" size={20} />
                    <span className="font-medium text-green-800">Contact Details Unlocked!</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">Name:</span>
                      <span className="ml-2 text-gray-800">{documentData.contact?.full_name || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="font-medium text-gray-700">Phone:</span>
                      <span className="ml-2 text-gray-800">{documentData.contact?.phone || "N/A"}</span>
                    </div>
                    {documentData.contact?.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="font-medium text-gray-700">Email:</span>
                        <span className="ml-2 text-gray-800">{documentData.contact.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-4">
                {contactUnlocked 
                  ? "Please contact the finder to arrange document pickup. Thank you for using our platform!"
                  : "After payment, you'll be able to contact the finder directly."
                }
              </p>
              <a 
                href="/" 
                className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            documentData={{
              type: 'found',
              id: documentData.id
            }}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
    </div>
  );
}
