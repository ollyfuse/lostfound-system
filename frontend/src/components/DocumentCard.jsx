import { useState } from "react";
import { Calendar, MapPin, Hash, Eye, MessageSquare } from "lucide-react";
import ClaimForm from "./ClaimForm";
import axiosClient from "../api/axiosClient";

export default function DocumentCard({ document, type, onTabChange }) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verificationInput, setVerificationInput] = useState("");
  const [showUnblurred, setShowUnblurred] = useState(false);
  const [unmaskedDocument, setUnmaskedDocument] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const handleVerification = async () => {
    const input = verificationInput.trim();
    
    try {
      const response = await axiosClient.post(`verify/${type}/${document.id}/`, {
        verification_input: input
      });
      
      if (response.data.verified) {
        setVerified(true);
        setShowUnblurred(true);
        setUnmaskedDocument(response.data.document);
        
        setTimeout(() => {
          setShowUnblurred(false);
          setVerified(false);
          setVerificationInput("");
          setUnmaskedDocument(null);
        }, 3000);
      } else {
        alert("Verification failed. Please enter the correct document number or owner name.");
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert("Verification failed. Please try again.");
    }
  };

  const displayDocument = showUnblurred && unmaskedDocument ? unmaskedDocument : document;

  return (
    <>
      {/* Professional Sized Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        {/* Image Section - Medium Size */}
        {document.image ? (
          <div className="h-48 bg-gray-100 overflow-hidden relative rounded-t-xl">
            <img 
              src={document.image} 
              alt={`${type} document`}
              className="w-full h-full object-cover filter blur-sm"
            />
            <div className="absolute inset-0 bg-black bg-opacity-15 flex items-center justify-center">
              <span className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium">
                🔒 Blurred for Privacy
              </span>
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gray-50 flex items-center justify-center rounded-t-xl">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">📄</div>
              <span className="text-sm">No Image Available</span>
            </div>
          </div>
        )}
        
        {/* Content Section */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              type === 'found' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {type === 'found' ? '📄 Found' : '🔍 Lost'}
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(document.created_at)}
            </div>
          </div>

          {/* Document Type */}
          <h3 className="font-semibold text-gray-800 mb-3 text-lg">
            {document.document_type?.name || document.document_type || "N/A"}
          </h3>

          {/* Key Details */}
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <span className="font-medium w-16">Name:</span>
              <span className="flex-1 truncate">
                {type === 'found' 
                  ? (displayDocument.found_name || displayDocument.finder_name || "N/A")
                  : (displayDocument.Owner_name || displayDocument.owner_name || "N/A")
                }
              </span>
            </div>
            
            <div className="flex items-center">
              <Hash className="w-3 h-3 mr-1" />
              <span className="font-medium w-15">Number:</span>
              <span className="flex-1 truncate">
                {document.document_number || "N/A"}
              </span>
            </div>

            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="font-medium w-15">
                {type === 'found' ? 'Found at:' : 'Lost at:'}
              </span>
              <span className="flex-1 truncate">
                {type === 'found' 
                  ? (document.where_found || "N/A")
                  : (document.where_lost || "N/A")
                }
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowDetailsModal(true)}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition text-sm font-medium flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>View Full Details</span>
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Document Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {document.image && (
                <div className="mb-6">
                  {!showUnblurred ? (
                    <div className="h-64 bg-gray-200 relative rounded-lg overflow-hidden">
                      <img 
                        src={document.image} 
                        alt="Document (blurred for privacy)"
                        className="w-full h-full object-cover filter blur-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg text-center max-w-sm">
                          <div className="text-3xl mb-3">🔒</div>
                          <h3 className="font-semibold mb-2">Verification Required</h3>
                          <p className="text-sm text-gray-600 mb-3">
                            Enter the document number or owner name to verify ownership
                          </p>
                          <input
                            type="text"
                            placeholder="Document number or owner name"
                            value={verificationInput}
                            onChange={(e) => setVerificationInput(e.target.value)}
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
                    <div className="h-64 bg-gray-200 rounded-lg overflow-hidden relative">
                      <img 
                        src={document.image} 
                        alt="Document"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded text-sm">
                        ✓ Verified - Auto-hiding in 3s
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    type === 'found' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {type === 'found' ? '📄 Found Document' : '🔍 Lost Document'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(displayDocument.created_at)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800">
                  {displayDocument.document_type?.name || displayDocument.document_type || "N/A"}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="ml-2 text-gray-600">
                      {type === 'found' 
                        ? (displayDocument.found_name || displayDocument.finder_name || "N/A")
                        : (displayDocument.Owner_name || displayDocument.owner_name || "N/A")
                      }
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Document Number:</span>
                    <span className="ml-2 text-gray-600">{displayDocument.document_number || "N/A"}</span>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">
                      {type === 'found' ? 'Found at:' : 'Lost at:'}
                    </span>
                    <span className="ml-2 text-gray-600">
                      {type === 'found' 
                        ? (displayDocument.where_found || "N/A")
                        : (displayDocument.where_lost || "N/A")
                      }
                    </span>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">
                      {type === 'found' ? 'Found on:' : 'Lost on:'}
                    </span>
                    <span className="ml-2 text-gray-600">
                      {type === 'found' 
                        ? formatDate(displayDocument.when_found)
                        : formatDate(displayDocument.when_lost)
                      }
                    </span>
                  </div>

                  {displayDocument.description && (
                    <div>
                      <span className="font-medium text-gray-700">Description:</span>
                      <p className="mt-1 text-gray-600">{displayDocument.description}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    if (type === 'lost') {
                      onTabChange('upload-found');
                    } else {
                      setShowClaimModal(true);
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-lg transition font-medium ${
                    type === 'found'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {type === 'found' ? 'Claim This Document' : 'I Found This'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Claim Document</h2>
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-sm text-gray-700">
                  {document.document_type?.name || document.document_type || "N/A"}
                </h3>
                <p className="text-sm text-gray-600">
                  {type === 'found' 
                    ? (document.found_name || "N/A")
                    : (document.Owner_name || "N/A")
                  }
                </p>
              </div>

              <ClaimForm 
                reportType={type} 
                reportId={document.id}
                onSuccess={() => setShowClaimModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
