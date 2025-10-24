import { useState } from "react";
import { Mail, Phone, Hash, Shield, CheckCircle, AlertCircle } from "lucide-react";
import axiosClient from "../api/axiosClient";

export default function ClaimForm({ reportType, reportId, onSuccess }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Sending verification email...");
    
    try {
      const payload = {
        report_type: reportType,
        report_id: reportId,
        contact_email: email,
        contact_phone: phone,
      };
      if (docNumber) payload.document_number = docNumber;

      await axiosClient.post("claims/start/", payload);
      setStatus("success");
      
      // Reset form
      setEmail("");
      setPhone("");
      setDocNumber("");

      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || "Failed to send verification email.";
      setStatus(`error:${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Shield className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Claim This Document</h3>
          <p className="text-sm text-gray-500">Verify your ownership to access full details</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Your email address" 
            type="email" 
            required 
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="Phone number (optional)" 
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Hash className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            value={docNumber} 
            onChange={(e) => setDocNumber(e.target.value)} 
            placeholder="Document number (helps verify ownership)" 
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending Verification...</span>
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              <span>Send Verification Email</span>
            </>
          )}
        </button>
      </form>
      
      {status && (
        <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
          status === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : status.startsWith('error:')
            ? 'bg-red-50 border border-red-200'
            : 'bg-blue-50 border border-blue-200'
        }`}>
          {status === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Verification Email Sent!</p>
                <p className="text-sm text-green-700 mt-1">
                  Check your inbox and click the verification link to access full document details.
                </p>
              </div>
            </>
          ) : status.startsWith('error:') ? (
            <>
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Verification Failed</p>
                <p className="text-sm text-red-700 mt-1">
                  {status.replace('error:', '')}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5"></div>
              <div>
                <p className="font-medium text-blue-800">Processing Request</p>
                <p className="text-sm text-blue-700 mt-1">{status}</p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 flex items-center gap-2">
          <Shield className="w-3 h-3" />
          Your information is secure and only used for verification purposes.
        </p>
      </div>
    </div>
  );
}
