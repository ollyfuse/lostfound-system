import { useState } from "react";
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
      setStatus("✅ Verification email sent — check your inbox.");
      
      // Reset form
      setEmail("");
      setPhone("");
      setDocNumber("");

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || "Failed to send verification email.";
      setStatus(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">🔐 Claim This Document</h3>
      <p className="text-sm text-gray-600 mb-4">
        If this is your document, verify your ownership to see full details and contact information.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Your email address" 
          type="email" 
          required 
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        />
        
        <input 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          placeholder="Phone number (optional)" 
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        />
        
        <input 
          value={docNumber} 
          onChange={(e) => setDocNumber(e.target.value)} 
          placeholder="Document number (if you know it)" 
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        />
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Request Verification"}
        </button>
      </form>
      
      {status && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          status.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {status}
        </div>
      )}
    </div>
  );
}
