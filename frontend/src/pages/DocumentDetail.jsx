import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import ClaimForm from "../components/ClaimForm";

export default function DocumentDetail() {
  const { type, id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axiosClient.get(`${type}/${id}/`);
        setDocument(response.data);
      } catch (err) {
        console.error("Failed to fetch document:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [type, id]);

  const handleVerification = () => {
    if (verificationCode.toLowerCase() === "verify") {
      setVerified(true);
    } else {
      alert("Invalid verification code. Use 'verify' for demo purposes.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document details...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Document Not Found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Browse Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Browse Documents
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Document Details</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {document.image && (
              <div className="md:w-1/2">
                {!verified ? (
                  <div className="h-96 bg-gray-200 relative">
                    <img 
                      src={document.image} 
                      alt="Document (blurred for privacy)"
                      className="w-full h-full object-cover filter blur-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="bg-white p-6 rounded-lg text-center max-w-sm">
                        <div className="text-4xl mb-4">🔒</div>
                        <h3 className="font-semibold mb-2">Verification Required</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Enter verification code to view original image
                        </p>
                        <input
                          type="text"
                          placeholder="Enter code (use 'verify')"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="w-full border rounded px-3 py-2 mb-3 text-sm"
                        />
                        <button
                          onClick={handleVerification}
                          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
                        >
                          Verify & View
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-96 bg-gray-200">
                    <img 
                      src={document.image} 
                      alt="Document"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            <div className={`p-6 ${document.image ? 'md:w-1/2' : 'w-full'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  type === 'found' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {type === 'found' ? '📄 Found Document' : '🔍 Lost Document'}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(document.created_at)}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {document.document_type?.name || document.document_type}
              </h2>

              <div className="space-y-3 mb-6">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-600">
                    {type === 'found' ? document.finder_name : document.owner_name}
                  </span>
                </div>
                
                {document.document_number && (
                  <div>
                    <span className="font-medium text-gray-700">Document Number:</span>
                    <span className="ml-2 text-gray-600">{document.document_number}</span>
                  </div>
                )}

                {document.description && (
                  <div>
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="mt-1 text-gray-600">{document.description}</p>
                  </div>
                )}

                {document.location && (
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2 text-gray-600">{document.location}</span>
                  </div>
                )}

                {document.contact_info && (
                  <div>
                    <span className="font-medium text-gray-700">Contact:</span>
                    <span className="ml-2 text-gray-600">{document.contact_info}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowClaimForm(!showClaimForm)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                {showClaimForm ? "Cancel Claim" : "Claim This Document"}
              </button>

              {showClaimForm && (
                <div className="mt-6">
                  <ClaimForm reportType={type} reportId={document.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
