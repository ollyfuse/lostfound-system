import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, FileText, AlertCircle } from "lucide-react";
import axiosClient from "../api/axiosClient";
import DocumentCard from "../components/DocumentCard";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function PublicDocuments({onTabChange}) {
  const { t } = useLanguage();
  const [lostDocs, setLostDocs] = useState([]);
  const [foundDocs, setFoundDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("found");
  const [currentPage, setCurrentPage] = useState(1);
  const [rotationIndex, setRotationIndex] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          axiosClient.get("lost/search/"),
          axiosClient.get("found/search/")
        ]);
        setLostDocs(lostRes.data);
        setFoundDocs(foundRes.data);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Premium rotation timer
  useEffect(() => {
    if (activeTab !== "lost") return;

    const premiumDocs = lostDocs.filter(doc => doc.is_premium);
    if (premiumDocs.length <= 1) return;

    const interval = setInterval(() => {
      setRotationIndex(prev => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, [lostDocs, activeTab]);

  // Sort documents with random premium rotation
  const sortedDocs = useMemo(() => {
    if (activeTab === "found") {
      return foundDocs;
    }

    const premiumDocs = lostDocs.filter(doc => doc.is_premium);
    const regularDocs = lostDocs.filter(doc => !doc.is_premium);

    if (premiumDocs.length === 0) {
      return regularDocs;
    }

    // Randomly shuffle all premium documents
    const startIndex = rotationIndex % premiumDocs.length;
    const rotatedPremium = [...premiumDocs.slice(startIndex), ...premiumDocs.slice(0, startIndex)];
    
    return [...rotatedPremium, ...regularDocs];
  }, [activeTab, lostDocs, foundDocs, rotationIndex]);

  const premiumCount = useMemo(() => 
    lostDocs.filter(doc => doc.is_premium).length, 
    [lostDocs]
  );

  const paginationData = useMemo(() => ({
    totalPages: Math.ceil(sortedDocs.length / itemsPerPage),
    startIndex: (currentPage - 1) * itemsPerPage,
    endIndex: (currentPage - 1) * itemsPerPage + itemsPerPage
  }), [sortedDocs.length, currentPage]);

  const currentItems = useMemo(() => 
    sortedDocs.slice(paginationData.startIndex, paginationData.endIndex),
    [sortedDocs, paginationData.startIndex, paginationData.endIndex]
  );

  // Handle tab changes and hash navigation
  useEffect(() => {
    // Reset pagination when tab changes
    setCurrentPage(1);
    setRotationIndex(0);
  }, [activeTab]);

  // Handle initial hash navigation (runs once on mount)
  useEffect(() => {
    if (window.location.hash === '#lost-tab') {
      setActiveTab('lost');
      window.location.hash = '';
    }
  }, []);

  // Calculate pagination
  const { totalPages, startIndex, endIndex } = paginationData;

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingDocuments')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {t('recentlyReportedAndFound')}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
          {t('browseLatestDocuments')}
        </p>
      </div>

      {/* Refined Tabs Section */}
      <div className="mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 rounded-2xl p-1.5 shadow-inner">
            <button
              onClick={() => setActiveTab("found")}
              className={`relative px-8 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${
                activeTab === "found"
                  ? "bg-white text-green-700 shadow-md"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>{t('foundDocuments')}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === "found" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {foundDocs.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("lost")}
              className={`relative px-8 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${
                activeTab === "lost"
                  ? "bg-white text-red-700 shadow-md"
                  : "text-gray-600 hover:text-red-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{t('lostReports')}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === "lost" 
                    ? "bg-red-100 text-red-700" 
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {lostDocs.length}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Description */}
        <div className="text-center">
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            {activeTab === "found" 
              ? t('foundDocumentsDescription')
              : t('lostDocumentsDescription')
            }
          </p>
        </div>

        {/* Premium Rotation Indicator */}
        {activeTab === "lost" && premiumCount > 1 && (
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-yellow-700 font-medium">
                {t('premiumListingsRotate')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Documents Grid */}
      <div className="max-w-6xl mx-auto px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentItems.map((doc) => (
            <DocumentCard 
              key={doc.id} 
              document={doc} 
              type={activeTab} 
              onTabChange={onTabChange}
              id={`document-${doc.id}`}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4 mb-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t('previous')}
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {t('next')}
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="text-sm text-gray-500">
            {t('showingResults', {
              start: startIndex + 1,
              end: Math.min(endIndex, sortedDocs.length),
              total: sortedDocs.length
            })}
          </div>
        </div>
      )}

      {/* Enhanced Empty State */}
      {sortedDocs.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {activeTab === "found" ? (
              <FileText className="w-12 h-12 text-gray-400" />
            ) : (
              <AlertCircle className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">
            {t('noDocumentsYet', { type: activeTab })}
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {activeTab === "found"
              ? t('noFoundDocumentsMessage')
              : t('noLostDocumentsMessage')
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setActiveTab(activeTab === "found" ? "lost" : "found")}
              className="px-6 py-2 text-blue-600 hover:text-blue-800 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {t('viewOtherTab', { 
                type: activeTab === "found" ? t('lostReports') : t('foundDocuments')
              })}
            </button>
            <button 
              onClick={() => onTabChange(activeTab === "found" ? "upload-found" : "report-lost")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {activeTab === "found" ? t('reportFoundDocument') : t('reportLostDocument')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
