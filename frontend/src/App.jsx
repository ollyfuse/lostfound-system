import { lazy, Suspense, memo, useCallback, useMemo } from "react";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Search, Plus, Upload, FileText, Heart, X, CheckCircle } from "lucide-react";
import LostDocumentForm from "./components/LostDocumentForm";
import FoundDocumentForm from "./components/FoundDocumentForm";
import DocumentCard from "./components/DocumentCard";
const PublicDocuments = lazy(() => import("./pages/PublicDocuments"));
const DocumentDetails = lazy(() => import("./pages/DocumentDetail"));
import axiosClient from "./api/axiosClient";
import Footer from "./components/Footer";
const RemoveDocument = lazy(() => import("./pages/RemoveDocument"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/TermsOfService"));
const HelpCenter = lazy(() => import("./components/HelpCenter"));
const HowItWorks = lazy(() => import("./components/HowItWorks"));
const ContactUs = lazy(() => import("./components/ContactUs"));
import { LanguageProvider, useLanguage } from './i18n/LanguageContext.jsx';
import LanguageSwitcher from './components/LanguageSwitcher';

const SearchOverlay = memo(function SearchOverlay({ isOpen, onClose, searchQuery, setSearchQuery, handleTabChange }) {
  const { t } = useLanguage();
  const [results, setResults] = useState({ lost: [], found: [] });
  const [loading, setLoading] = useState(false);

  const totalResults = useMemo(() => 
    results.lost.length + results.found.length, 
    [results.lost.length, results.found.length]
  );

  const handleDocumentClick = useCallback((doc, type) => {
    onClose(); 
    handleTabChange("browse"); 
    setTimeout(() => {
      if (type === 'lost') {
        window.location.hash = 'lost-tab';
      }
      setTimeout(() => {
        const element = document.getElementById(`document-${doc.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-4', `ring-${type === 'lost' ? 'red' : 'blue'}-400`, 'ring-opacity-75');
          element.style.transition = 'all 0.3s ease';
          setTimeout(() => {
            element.classList.remove('ring-4', `ring-${type === 'lost' ? 'red' : 'blue'}-400`, 'ring-opacity-75');
          }, 3000);
        }
      }, type === 'lost' ? 200 : 0);
    }, 500);
  }, [onClose, handleTabChange]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults({ lost: [], found: [] });
      return;
    }
    
    const fetchResults = async () => {
      setLoading(true);
      try {
        const [lostRes, foundRes] = await Promise.all([
          axiosClient.get(`lost/search/?search=${searchQuery}`),
          axiosClient.get(`found/search/?search=${searchQuery}`)
        ]);
        setResults({ lost: lostRes.data, found: foundRes.data });
      } catch (err) {
        console.error("Search error:", err);
        setResults({ lost: [], found: [] });
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{t('searchDocuments')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none px-3 text-gray-700"
              autoFocus
            />
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('searching')}</p>
            </div>
          )}

          {!loading && searchQuery && totalResults === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {t('noDocumentsFound')}
              </h3>
              <p className="text-gray-500">
                {t('noMatchesFor')} "{searchQuery}"
              </p>
            </div>
          )}

          {!loading && searchQuery && totalResults > 0 && (
            <div>
              <div className="mb-4">
                <p className="text-gray-600">
                  {t('found')} {totalResults} {t('document')}{totalResults !== 1 ? 's' : ''}
                </p>
              </div>

              {results.found.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-green-700 mb-3">
                    {t('foundDocuments')} ({results.found.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.found.slice(0, 4).map((doc) => (
                     <div key={doc.id} className="transform scale-90 cursor-pointer" onClick={() => handleDocumentClick(doc, 'found')}>
                          <DocumentCard document={doc} type="found" />
                        </div>
                    ))}
                  </div>
                  {results.found.length > 4 && (
                    <p className="text-sm text-gray-500 mt-2">
                      {t('andMore')} {results.found.length - 4} {t('moreFoundDocuments')}
                    </p>
                  )}
                </div>
              )}

              {results.lost.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-700 mb-3">
                    {t('lostReports')} ({results.lost.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.lost.slice(0, 4).map((doc) => (
                     <div key={doc.id} className="transform scale-90 cursor-pointer" onClick={() => handleDocumentClick(doc, 'lost')}>
                          <DocumentCard document={doc} type="lost" />
                        </div>
                    ))}
                  </div>
                  {results.lost.length > 4 && (
                    <p className="text-sm text-gray-500 mt-2">
                      {t('andMore')} {results.lost.length - 4} {t('moreLostReports')}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {!searchQuery && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {t('startTypingToSearch')}
              </h3>
              <p className="text-gray-500">
                {t('searchByNameType')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

function HomePage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [stats, setStats] = useState({
    total_matched: 250,
    total_lost: 500,
    success_rate: 98
  });

  const fetchStats = useCallback(async () => {
    try {
      const response = await axiosClient.get('stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSearchFocus = useCallback(() => {
    setShowSearchOverlay(true);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setShowSearchOverlay(false);
    setSearchQuery("");
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setTimeout(() => {
      const contentSection = document.querySelector('#content-section');
      if (contentSection) {
        contentSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  }, []);

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "browse":
        return <PublicDocuments onTabChange={handleTabChange}/>;
      case "report-lost":
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              {t('reportLostDocument')}
            </h2>
            <h4 className="text-1xl text-center mb-6 text-gray-400">
              {t('reportLostDesc')}
            </h4>
            <LostDocumentForm />
          </div>
        );
      case "upload-found":
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              {t('uploadFoundDocument')}
            </h2>
            <h4 className="text-1xl text-center mb-6 text-gray-400">{t('uploadFoundDesc')}</h4>
            <FoundDocumentForm />
          </div>
        );
      default:
        return <PublicDocuments onTabChange={handleTabChange}/>;
    }
  }, [activeTab, handleTabChange, t]);

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col">
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-md">
              <FileText className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                {t('docuFind')}
              </h1>
              <p className="text-sm text-slate-500 -mt-0.5">
                {t('lostFoundDocuments')}
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-2xl w-full">
            <div 
              onClick={handleSearchFocus}
              className="flex items-center bg-slate-50 rounded-xl px-5 py-3 shadow-sm border border-slate-200 cursor-pointer hover:bg-slate-100 hover:shadow-md transition-all duration-200"
            >
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="flex-1 bg-transparent outline-none px-3 text-slate-700 text-sm cursor-pointer placeholder-slate-400"
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleTabChange("report-lost")}
              className="flex items-center space-x-2 border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>{t('reportLost')}</span>
            </button>
            <button
              onClick={() => handleTabChange("upload-found")}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Upload className="w-4 h-4" />
              <span>{t('uploadFound')}</span>
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="text-center py-16 bg-gradient-to-b from-[#e8f2ff] to-[#f7f9fc]">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
            {t('heroTitle')}{" "}
            <span className="text-blue-600">{t('importantDocuments')}</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600 text-base md:text-lg">
            {t('heroDescription')}
          </p>

          <div className="mt-8 flex justify-center space-x-3">
            <button
              onClick={() => handleTabChange("report-lost")}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-md transition shadow-sm"
            >
              <FileText className="w-5 h-5 mr-2" />
              {t('reportLostDocument')}
            </button>
            <button
              onClick={() => handleTabChange("upload-found")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-3 rounded-md transition shadow-sm"
            >
              <Heart className="w-5 h-5 mr-2" />
              {t('helpSomeoneFind')}
            </button>
          </div>
        </section>

        <section className="py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('howItWorks')}</h3>
              <p className="text-gray-600">{t('simpleSteps')}</p>
            </div>
            <div className="flex justify-center items-center gap-12">
              <div className="hidden lg:block space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm">{t('privacyProtected')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Heart className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm">{t('communityDriven')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Search className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm">{t('smartMatching')}</span>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative w-80 h-48">
                  <div 
                    className="absolute top-0 left-0 w-64 h-36 bg-blue-500 rounded-lg shadow-xl transform z-40"
                    style={{
                      animation: 'cardCycle1 12s ease-in-out infinite'
                    }}
                  >
                    <div className="p-3 text-white">
                      <FileText className="w-5 h-5 mb-1" />
                      <h4 className="font-bold text-sm">1. {t('report')}</h4>
                      <p className="text-xs opacity-90">{t('reportDesc')}</p>
                    </div>
                  </div>
                  
                  <div 
                    className="absolute top-2 left-2 w-64 h-36 bg-green-500 rounded-lg shadow-lg transform z-30"
                    style={{
                      animation: 'cardCycle2 12s ease-in-out infinite'
                    }}
                  >
                    <div className="p-3 text-white">
                      <Upload className="w-5 h-5 mb-1" />
                      <h4 className="font-bold text-sm">2. {t('upload')}</h4>
                      <p className="text-xs opacity-90">{t('uploadDesc')}</p>
                    </div>
                  </div>
                  
                  <div 
                    className="absolute top-4 left-4 w-64 h-36 bg-purple-500 rounded-lg shadow-lg transform z-20"
                    style={{
                      animation: 'cardCycle3 12s ease-in-out infinite'
                    }}
                  >
                    <div className="p-3 text-white">
                      <Search className="w-5 h-5 mb-1" />
                      <h4 className="font-bold text-sm">3. {t('match')}</h4>
                      <p className="text-xs opacity-90">{t('matchDesc')}</p>
                    </div>
                  </div>
                  
                  <div 
                    className="absolute top-6 left-6 w-64 h-36 bg-orange-400 rounded-lg shadow-lg transform z-10"
                    style={{
                      animation: 'cardCycle4 12s ease-in-out infinite'
                    }}
                  >
                    <div className="p-3 text-white">
                      <Heart className="w-5 h-5 mb-1" />
                      <h4 className="font-bold text-sm">4. {t('reunite')}</h4>
                      <p className="text-xs opacity-90">{t('reuniteDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <span className="text-sm text-right">{t('fastSecure')}</span>
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Upload className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <span className="text-sm text-right">{t('available247')}</span>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <span className="text-sm text-right">{t('freeService')}</span>
                  <div className="bg-green-100 p-2 rounded-full">
                    <Heart className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">              
              <div className="flex justify-center items-center gap-8 text-xs">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500 p-1 rounded-full">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-600">
                    <span className="font-bold text-blue-600">{stats.total_matched}+</span> {t('reunited')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-green-500 p-1 rounded-full">
                    <FileText className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-600">
                    <span className="font-bold text-green-600">{stats.total_lost + stats.total_found}+</span> {t('active')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-purple-500 p-1 rounded-full">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-600">
                    <span className="font-bold text-purple-600">{stats.success_rate}%</span> {t('success')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes cardCycle1 {
              0%, 25% { transform: translateX(0) translateY(0) rotate(0deg) scale(1.1); z-index: 5; }
              25.01%, 50% { transform: translateX(8px) translateY(8px) rotate(-2deg) scale(1); z-index: 3; }
              50.01%, 75% { transform: translateX(16px) translateY(16px) rotate(3deg) scale(1); z-index: 2; }
              75.01%, 100% { transform: translateX(24px) translateY(24px) rotate(6deg) scale(1); z-index: 1; }
            }
            @keyframes cardCycle2 {
              0%, 25% { transform: translateX(24px) translateY(24px) rotate(6deg) scale(1); z-index: 1; }
              25.01%, 50% { transform: translateX(0) translateY(0) rotate(0deg) scale(1.1); z-index: 5; }
              50.01%, 75% { transform: translateX(8px) translateY(8px) rotate(-2deg) scale(1); z-index: 3; }
              75.01%, 100% { transform: translateX(16px) translateY(16px) rotate(3deg) scale(1); z-index: 2; }
            }
            @keyframes cardCycle3 {
              0%, 25% { transform: translateX(16px) translateY(16px) rotate(3deg) scale(1); z-index: 2; }
              25.01%, 50% { transform: translateX(24px) translateY(24px) rotate(6deg) scale(1); z-index: 1; }
              50.01%, 75% { transform: translateX(0) translateY(0) rotate(0deg) scale(1.1); z-index: 5; }
              75.01%, 100% { transform: translateX(8px) translateY(8px) rotate(-2deg) scale(1); z-index: 3; }
            }
            @keyframes cardCycle4 {
              0%, 25% { transform: translateX(8px) translateY(8px) rotate(-2deg) scale(1); z-index: 3; }
              25.01%, 50% { transform: translateX(16px) translateY(16px) rotate(3deg) scale(1); z-index: 2; }
              50.01%, 75% { transform: translateX(24px) translateY(24px) rotate(6deg) scale(1); z-index: 1; }
              75.01%, 100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1.1); z-index: 5; }
            }
          `
        }} />

        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('whatToDo')}</h3>
              <p className="text-gray-600">{t('chooseOption')}</p>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-gray-50 rounded-2xl p-2 shadow-inner border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button 
                    onClick={() => handleTabChange("browse")}
                    className={`group flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                      activeTab === "browse" 
                        ? "bg-blue-600 text-white shadow-lg transform scale-105" 
                        : "text-gray-700 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      activeTab === "browse" 
                        ? "bg-white/20" 
                        : "bg-blue-100 group-hover:bg-blue-200"
                    }`}>
                      <Search className={`w-5 h-5 ${
                        activeTab === "browse" ? "text-white" : "text-blue-600"
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{t('browseDocuments')}</div>
                      <div className={`text-sm ${
                        activeTab === "browse" ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {t('viewRecentReports')}
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleTabChange("report-lost")}
                    className={`group flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                      activeTab === "report-lost" 
                        ? "bg-red-600 text-white shadow-lg transform scale-105" 
                        : "text-gray-700 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      activeTab === "report-lost" 
                        ? "bg-white/20" 
                        : "bg-red-100 group-hover:bg-red-200"
                    }`}>
                      <FileText className={`w-5 h-5 ${
                        activeTab === "report-lost" ? "text-white" : "text-red-600"
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{t('reportLost')}</div>
                      <div className={`text-sm ${
                        activeTab === "report-lost" ? "text-red-100" : "text-gray-500"
                      }`}>
                        {t('missingDocument')}
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleTabChange("upload-found")}
                    className={`group flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                      activeTab === "upload-found" 
                        ? "bg-green-600 text-white shadow-lg transform scale-105" 
                        : "text-gray-700 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      activeTab === "upload-found" 
                        ? "bg-white/20" 
                        : "bg-green-100 group-hover:bg-green-200"
                    }`}>
                      <Upload className={`w-5 h-5 ${
                        activeTab === "upload-found" ? "text-white" : "text-green-600"
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{t('uploadFound')}</div>
                      <div className={`text-sm ${
                        activeTab === "upload-found" ? "text-green-100" : "text-gray-500"
                      }`}>
                        {t('foundSomething')}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="content-section" className="py-8">
          {renderContent}
        </section>
      </main>

      <SearchOverlay 
        isOpen={showSearchOverlay}
        onClose={handleCloseSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleTabChange={handleTabChange}
      />

      <Footer />
    </div>
  );
}

const AppContent = () => (
  <Router>
    <Suspense fallback={<div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify" element={<DocumentDetails />} />
        <Route path="/remove-document" element={<RemoveDocument />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </Suspense>
  </Router>
);

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
