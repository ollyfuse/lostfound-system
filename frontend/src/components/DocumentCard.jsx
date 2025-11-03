import { useState } from "react";
import { Calendar, MapPin, Hash, Eye, Crown, Star, X, Lock, CheckCircle, FileText, AlertCircle, User, Phone, Heart  } from "lucide-react";
import ClaimForm from "./ClaimForm";
import PremiumUpgradeModal from "./PremiumUpgradeModal";
import axiosClient from "../api/axiosClient";
import RemovalModal from "./RemovalModal";


export default function DocumentCard({ document, type, onTabChange }) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verificationInput, setVerificationInput] = useState("");
  const [showUnblurred, setShowUnblurred] = useState(false);
  const [unmaskedDocument, setUnmaskedDocument] = useState(null);
  const [showRemovalModal, setShowRemovalModal] = useState(false);


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
      <div className={`bg-white rounded-xl shadow-md border hover:shadow-lg transition-all duration-200 ${
        document.is_premium ? 'border-yellow-300 ring-2 ring-yellow-100' : 'border-gray-200'
      }`}>
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
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                type === 'found' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {type === 'found' ? '📄 Found' : '🔍 Lost'}
              </span>
              {document.is_premium && (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  <span>Premium</span>
                </span>
              )}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(document.created_at)}
            </div>
          </div>

          <h3 className="font-semibold text-gray-800 mb-3 text-lg">
            {document.document_type?.name || document.document_type || "Document"}
          </h3>

          {/* Refined Information Display */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">
                  {(type === 'found' 
                    ? (displayDocument.found_name || displayDocument.finder_name || "?")
                    : (displayDocument.Owner_name || displayDocument.owner_name || "?")
                  ).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 font-medium">Owner Name</p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {type === 'found' 
                    ? (displayDocument.found_name || displayDocument.finder_name || "Not specified")
                    : (displayDocument.Owner_name || displayDocument.owner_name || "Not specified")
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Hash className="w-4 h-4 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 font-medium">Document Number</p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {document.document_number || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 font-medium">
                  {type === 'found' ? 'Found Location' : 'Lost Location'}
                </p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {type === 'found' 
                    ? (document.where_found || "Location not specified")
                    : (document.where_lost || "Location not specified")
                  }
                </p>
              </div>
            </div>
          </div>
          {/* Professional Compact Button Layout */}
          <div className="space-y-2">
            <button
              onClick={() => setShowDetailsModal(true)}
              className="w-full bg-gray-300 hover:bg-gray-500 text-black py-2 px-3 rounded-md transition-colors font-medium text-sm flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3 h-3" />
              View Details
            </button>

            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  if (type === 'lost') {
                    onTabChange('upload-found');
                  } else {
                    setShowClaimModal(true);
                  }
                }}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-colors ${
                  type === 'found'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {type === 'found' ? 'Claim' : 'Report Found'}
              </button>
              {type === 'lost' && !document.is_premium && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-1.5 px-2 rounded-md text-xs font-medium transition-colors"
                >
                  Go Premium Listing
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {showUpgradeModal && (
        <PremiumUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          document={document}
          onSuccess={() => {
            setShowUpgradeModal(false);
            window.location.reload();
          }}
        />
      )}

      {showDetailsModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Document Details</h2>
          </div>
          <button
            onClick={() => setShowDetailsModal(false)}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal Content */}
      <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
        {document.image && (
          <div className="p-6 pb-0">
            {!showUnblurred ? (
              <div className="h-80 bg-gray-100 relative rounded-xl overflow-hidden">
                <img 
                  src={document.image} 
                  alt="Document (blurred for privacy)"
                  className="w-full h-full object-cover filter blur-lg"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-xl text-center max-w-sm mx-4 shadow-lg">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Verification Required</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Enter the document number or owner name to verify ownership
                    </p>
                    <input
                      type="text"
                      placeholder="Document number or owner name"
                      value={verificationInput}
                      onChange={(e) => setVerificationInput(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleVerification}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Verify & View
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-80 bg-gray-100 rounded-xl overflow-hidden relative">
                <img 
                  src={document.image} 
                  alt="Document"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Verified - Auto-hiding in 3s
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          {/* Document Status */}
          <div className="flex items-center justify-between mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
              type === 'found' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {type === 'found' ? (
                <>
                  <FileText className="w-4 h-4" />
                  Found Document
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Lost Document
                </>
              )}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(displayDocument.created_at)}
            </span>
          </div>

          {/* Document Title */}
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {displayDocument.document_type?.name || displayDocument.document_type || "Document"}
          </h3>

          {/* Document Information */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Owner Name</p>
                  <p className="text-gray-900">
                    {type === 'found' 
                      ? (displayDocument.found_name || displayDocument.finder_name || "Not specified")
                      : (displayDocument.Owner_name || displayDocument.owner_name || "Not specified")
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Hash className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Document Number</p>
                  <p className="text-gray-900">{displayDocument.document_number || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">
                    {type === 'found' ? 'Found Location' : 'Lost Location'}
                  </p>
                  <p className="text-gray-900">
                    {type === 'found' 
                      ? (displayDocument.where_found || "Location not specified")
                      : (displayDocument.where_lost || "Location not specified")
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">
                    {type === 'found' ? 'Date Found' : 'Date Lost'}
                  </p>
                  <p className="text-gray-900">
                    {type === 'found' 
                      ? formatDate(displayDocument.when_found)
                      : formatDate(displayDocument.when_lost)
                    }
                  </p>
                </div>
              </div>

              {displayDocument.description && (
                <div className="md:col-span-2 flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-gray-600 text-sm">📝</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Description</p>
                    <p className="text-gray-900">{displayDocument.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  if (type === 'lost') {
                    onTabChange('upload-found');
                  } else {
                    setShowClaimModal(true);
                  }
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                  type === 'found'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {type === 'found' ? (
                  <>
                    <Phone className="w-4 h-4" />
                    Claim
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    Report Found
                  </>
                )}
              </button>

              <button
                onClick={() => setShowRemovalModal(true)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 border border-gray-300"
              >
                <CheckCircle className="w-4 h-4" />
                Request Removal
              </button>
            </div>
        </div>
      </div>
    </div>
  </div>
)}
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
                  {displayDocument.document_type?.name || displayDocument.document_number || "Document"}
                </h3>
                <p className="text-sm text-gray-600">
                  {type === 'found' 
                    ? (displayDocument.document_number || "No number provided")
                    : (displayDocument.Owner_name || "No owner name")
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
      {showRemovalModal && (
        <RemovalModal
          document={document}
          type={type}
          onClose={() => setShowRemovalModal(false)}
          onSuccess={() => {
            setShowRemovalModal(false);
          }}
        />
      )}
    </>
  );
}
