import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Heart, Upload, Calendar, MapPin, User, Mail, Phone, FileText, Hash, Camera } from "lucide-react";
import axiosClient from "../api/axiosClient";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const useDebounce = (callback, delay) => {
  const [debounceTimer, setDebounceTimer] = useState(null);
  
  return useCallback((...args) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const newTimer = setTimeout(() => callback(...args), delay);
    setDebounceTimer(newTimer);
  }, [callback, delay, debounceTimer]);
};

export default function FoundDocumentForm() {
  const { t } = useLanguage();
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    document_type: "",
    found_name: "",
    document_number: "",
    where_found: "",
    when_found: "",
    description: "",
    contact_full_name: "",
    contact_email: "",
    contact_phone: "",
    image: null,
    agreeToTerms: false,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState({ type: null, message: "" });
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

  const handleInput = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ 
      ...p, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  }, []);

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
    uploadDropRef.current?.classList.remove("border-green-400", "bg-green-50");
  }

  function handleDragOver(e) {
    e.preventDefault();
    uploadDropRef.current?.classList.add("border-green-400", "bg-green-50");
  }

  function handleDragLeave(e) {
    uploadDropRef.current?.classList.remove("border-green-400", "bg-green-50");
  }

  const validation = useMemo(() => {
    if (!form.document_type) return t('pleaseSelectDocumentType');
    if (!form.where_found.trim()) return t('pleaseProvideWhereFound');
    if (!form.contact_full_name.trim()) return t('pleaseProvideYourName');
    if (!form.contact_email.trim()) return t('pleaseProvideYourEmail');
    if (!form.image) return t('pleaseUploadPhoto');
    if (!form.agreeToTerms) return t('pleaseAgreeToTerms');
    return null;
  }, [form.document_type, form.where_found, form.contact_full_name, form.contact_email, form.image, form.agreeToTerms, t]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "info", message: t('uploadingFoundDocument') });

    const err = validation;
    if (err) {
      setStatus({ type: "error", message: err });
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("document_type", form.document_type);
      data.append("found_name", form.found_name || "");
      data.append("document_number", form.document_number || "");
      data.append("where_found", form.where_found);
      if (form.when_found) data.append("when_found", form.when_found);
      if (form.description) data.append("description", form.description);
      data.append("contact_full_name", form.contact_full_name);
      data.append("contact_email", form.contact_email);
      if (form.contact_phone) data.append("contact_phone", form.contact_phone);
      if (form.image) data.append("image", form.image);

      await axiosClient.post("found/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus({ 
        type: "success", 
        message: t('foundDocumentUploadSuccess')
      });
      
      // Reset form
      setForm({
        document_type: "",
        found_name: "",
        document_number: "",
        where_found: "",
        when_found: "",
        description: "",
        contact_full_name: "",
        contact_email: "",
        contact_phone: "",
        image: null,
        agreeToTerms: false,
      });
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || t('uploadFailed');
      setStatus({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{t('uploadFoundDocument')}</h2>
              <p className="text-green-100 text-sm">{t('helpReuniteSomeone')}</p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="px-6 py-4 bg-amber-50 border-b">
          <div className="flex items-start space-x-3">
            <div className="bg-amber-100 p-1 rounded-full mt-0.5">
              <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">{t('privacyProtection')}</p>
              <p className="text-xs text-amber-600 mt-1">{t('privacyProtectionDesc')}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Document Photo Upload - First */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <Camera className="w-5 h-5 text-gray-500" />
              <span>{t('documentPhoto')} *</span>
            </h3>
            
            <div
              ref={uploadDropRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-400 transition-colors"
            >
              {!previewUrl ? (
                <div className="space-y-2">
                  <Upload className="mx-auto w-8 h-8 text-gray-400" />
                  <div className="text-sm font-medium text-gray-600">{t('uploadDocumentPhoto')}</div>
                  <div className="text-xs text-gray-500">
                    {t('uploadInstructions')}
                  </div>
                  <div className="text-xs text-amber-600">
                    {t('sensitiveInfoBlurred')}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <img src={previewUrl} alt="Preview" className="mx-auto max-h-32 object-contain rounded-lg" />
                  <div className="text-sm text-gray-600">{t('clickToReplace')}</div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </div>
          </div>

          {/* Document Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <span>{t('documentInformation')}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('documentType')} *
                </label>
                <select
                  name="document_type"
                  value={form.document_type}
                  onChange={handleInput}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                >
                  <option value="">{t('selectDocumentType')}</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('nameOnDocument')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="found_name"
                    value={form.found_name}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder={t('nameOnDocumentPlaceholder')}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('documentNumber')}
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="document_number"
                  value={form.document_number}
                  onChange={handleInput}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder={t('documentNumberFoundPlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* Location & Time Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span>{t('whereWhenFound')}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('whereDidYouFindIt')} *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="where_found"
                    value={form.where_found}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder={t('locationFoundPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('whenDidYouFindIt')}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="when_found"
                    type="date"
                    value={form.when_found}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('additionalDescription')}
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInput}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                placeholder={t('additionalDescriptionFoundPlaceholder')}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-500" />
              <span>{t('yourContactInformation')}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('yourName')} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="contact_full_name"
                    value={form.contact_full_name}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder={t('yourFullNamePlaceholder')}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('yourEmail')} *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="contact_email"
                    type="email"
                    value={form.contact_email}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder={t('emailPlaceholder')}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('yourPhoneNumber')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="contact_phone"
                  value={form.contact_phone}
                  onChange={handleInput}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder={t('phonePlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="pt-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={form.agreeToTerms}
                onChange={handleInput}
                className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                required
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                {t('agreeToTermsText')}{" "}
                <a 
                  href="/terms" 
                  target="_blank" 
                  className="text-green-600 hover:text-green-700 underline font-medium"
                >
                  {t('termsOfService')}
                </a>{" "}
                {t('agreeToTermsFoundEnd')}
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
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{t('uploading')}</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  <span>{t('submitFoundDocument')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
