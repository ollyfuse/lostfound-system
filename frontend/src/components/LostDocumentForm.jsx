import React, { useEffect, useState, useRef } from "react";
import { FileText, Upload, Calendar, MapPin, User, Mail, Phone, Hash } from "lucide-react";
import axiosClient from "../api/axiosClient";

export default function LostDocumentForm() {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    owner_name: "",
    email: "",
    phone: "",
    document_type: "",
    document_number: "",
    issue_date: "",
    where_lost: "",
    when_lost: "",
    description: "",
    image: null,
    agreeToTerms: false,
  });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const uploadDropRef = useRef(null);

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  async function fetchDocumentTypes() {
    try {
      const res = await axiosClient.get("document-types/");
      setTypes(res.data);
    } catch (err) {
      console.error("Failed to load document types", err);
      setTypes([]);
    }
  }

  function handleInput(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] ?? null;
    setForm((p) => ({ ...p, image: file }));
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setForm((p) => ({ ...p, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
      if (fileInputRef.current) fileInputRef.current.files = e.dataTransfer.files;
    }
    uploadDropRef.current?.classList.remove("border-blue-400", "bg-blue-50");
  }

  function handleDragOver(e) {
    e.preventDefault();
    uploadDropRef.current?.classList.add("border-blue-400", "bg-blue-50");
  }

  function handleDragLeave(e) {
    uploadDropRef.current?.classList.remove("border-blue-400", "bg-blue-50");
  }

  function validate() {
    if (!form.owner_name.trim()) return "Please provide the owner's full name.";
    if (!form.email.trim()) return "Please provide a contact email.";
    if (!form.document_type) return "Please select a document type.";
    if (!form.where_lost.trim()) return "Please provide the location where it was lost.";
    if (!form.agreeToTerms) return "Please agree to the Terms of Service to continue.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "info", message: "Submitting your report..." });

    const err = validate();
    if (err) {
      setStatus({ type: "error", message: err });
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("Owner_name", form.owner_name);
      data.append("contact_full_name", form.owner_name);
      data.append("contact_email", form.email);
      if (form.phone) data.append("contact_phone", form.phone);
      data.append("document_type", form.document_type);
      if (form.document_number) data.append("document_number", form.document_number);
      if (form.issue_date) data.append("issue_date", form.issue_date);
      data.append("where_lost", form.where_lost);
      if (form.when_lost) data.append("when_lost", form.when_lost);
      if (form.description) data.append("description", form.description);
      if (form.image) data.append("image", form.image);

      await axiosClient.post("lost/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus({ 
        type: "success", 
        message: "✅ Lost document reported successfully! We'll notify you if there's a match." 
      });
      
      // Reset form
      setForm({
        owner_name: "",
        email: "",
        phone: "",
        document_type: "",
        document_number: "",
        issue_date: "",
        where_lost: "",
        when_lost: "",
        description: "",
        image: null,
        agreeToTerms: false,
      });
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || "Failed to submit. Please try again.";
      setStatus({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Report Lost Document</h2>
              <p className="text-red-100 text-sm">Help us help you find your important documents</p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="px-6 py-4 bg-blue-50 border-b">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-1 rounded-full mt-0.5">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Your Privacy is Protected</p>
              <p className="text-xs text-blue-600 mt-1">Only partial details will be visible to others to protect your personal information.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-500" />
              <span>Personal Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="owner_name"
                    value={form.owner_name}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleInput}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  placeholder="+250 7xx xxx xxx"
                />
              </div>
            </div>
          </div>

          {/* Document Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <span>Document Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type *
                </label>
                <select
                  name="document_type"
                  value={form.document_type}
                  onChange={handleInput}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  required
                >
                  <option value="">Select document type</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Number
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="document_number"
                    value={form.document_number}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="Document ID number"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="issue_date"
                  type="date"
                  value={form.issue_date}
                  onChange={handleInput}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Photo (Optional)
              </label>
              <div
                ref={uploadDropRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-red-400 transition-colors"
              >
                {!previewUrl ? (
                  <div className="space-y-2">
                    <Upload className="mx-auto w-8 h-8 text-gray-400" />
                    <div className="text-sm font-medium text-gray-600">Upload Document Photo</div>
                    <div className="text-xs text-gray-500">
                      JPG, PNG up to 10MB • Drag & drop or click to browse
                    </div>
                    <div className="text-xs text-blue-600">
                      Sensitive information will be automatically protected
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <img src={previewUrl} alt="Preview" className="mx-auto max-h-32 object-contain rounded-lg" />
                    <div className="text-sm text-gray-600">Click to replace image</div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Loss Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span>Loss Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where was it lost? *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="where_lost"
                    value={form.where_lost}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="City, neighborhood, or specific location"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When was it lost?
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="when_lost"
                    type="date"
                    value={form.when_lost}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInput}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition resize-none"
                placeholder="Any additional details that might help identify your document..."
              />
            </div>
          </div>
          <div className="pt-4">
  <div className="flex items-start gap-3">
    <input
      type="checkbox"
      id="agreeToTerms"
      name="agreeToTerms"
      checked={form.agreeToTerms}
      onChange={handleInput}
      className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
      required
    />
    <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
      I agree to the{" "}
      <a 
        href="/terms" 
        target="_blank" 
        className="text-red-600 hover:text-red-700 underline font-medium"
      >
        Terms of Service
      </a>{" "}
      and understand that my information will be used to help recover my lost document.
    </label>
  </div>
</div>

          {/* Status Message */}
          {status.type && (
            <div className={`p-4 rounded-lg ${
              status.type === "error" 
                ? "bg-red-50 text-red-700 border border-red-200" 
                : status.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}>
              {status.message}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Submit Lost Document Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
