import { useState } from "react";
import { X, AlertTriangle, Mail } from "lucide-react";
import axiosClient from "../api/axiosClient";

export default function RemovalModal({ document, type, onClose, onSuccess }) {
  const [verificationInput, setVerificationInput] = useState("");
  const [reason, setReason] = useState("FOUND");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Sending removal request...");

    try {
      const response = await axiosClient.post(
        `documents/${type}/${document.id}/request-removal/`,
        {
          verification_input: verificationInput,
          reason: reason
        }
      );

      if (response.data.success) {
        setStatus("success");
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      setStatus(`error:${error.response?.data?.error || "Failed to send removal request"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Remove Document</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800">
              {document.document_type?.name || document.document_type}
            </h3>
            <p className="text-sm text-gray-600">
              Document #{document.document_number || "Not specified"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verify Ownership
              </label>
              <input
                type="text"
                placeholder="Enter your name or document number"
                value={verificationInput}
                onChange={(e) => setVerificationInput(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Removal
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="FOUND">Document Found</option>
                <option value="NO_LONGER_NEEDED">No Longer Needed</option>
                <option value="DUPLICATE">Duplicate Listing</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !verificationInput.trim()}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending Request...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Removal Email
                </>
              )}
            </button>
          </form>

          {status && (
            <div className={`mt-4 p-4 rounded-lg ${
              status === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : status.startsWith('error:')
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-blue-50 border border-blue-200 text-blue-800'
            }`}>
              {status === 'success' ? (
                <div className="text-center">
                  <p className="font-medium">✅ Email Sent!</p>
                  <p className="text-sm mt-1">Check your inbox and click the confirmation link.</p>
                </div>
              ) : status.startsWith('error:') ? (
                <p>{status.replace('error:', '')}</p>
              ) : (
                <p>{status}</p>
              )}
            </div>
          )}

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              ⚠️ A confirmation email will be sent to verify this removal request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
