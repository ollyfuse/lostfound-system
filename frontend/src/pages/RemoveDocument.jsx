import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function RemoveDocument() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      confirmRemoval();
    } else {
      setError('Invalid removal link');
      setLoading(false);
    }
  }, [token]);

  const confirmRemoval = async () => {
    try {
      const response = await axiosClient.get(`documents/confirm-removal/?token=${token}`);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove document');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Processing removal request...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        {result ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Document Removed!</h1>
            <p className="text-gray-600 mb-6">
              Your <strong>{result.document_name}</strong> listing has been successfully removed from DocuFind.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                ✅ The document is no longer visible in public listings
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Removal Failed</h1>
            <p className="text-gray-600 mb-6">{error}</p>
          </>
        )}
        
        <a 
          href="/" 
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </a>
      </div>
    </div>
  );
}
