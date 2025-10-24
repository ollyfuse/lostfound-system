import { useEffect, useState } from "react";
import { Search, Filter, Calendar, ChevronLeft, ChevronRight, FileText, AlertCircle } from "lucide-react";
import axiosClient from "../api/axiosClient";
import DocumentCard from "../components/DocumentCard";

export default function PublicDocuments({onTabChange}) {
  const [lostDocs, setLostDocs] = useState([]);
  const [foundDocs, setFoundDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("found");
  const [currentPage, setCurrentPage] = useState(1);
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

  // Reset to page 1 when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Get current documents based on active tab
  const currentDocs = activeTab === "found" ? foundDocs : lostDocs;
  
  // Calculate pagination
  const totalPages = Math.ceil(currentDocs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = currentDocs.slice(startIndex, endIndex);

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
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
         Recently Reported and Found Documents
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
          Browse the latest documents reported as lost or successfully recovered. Stay informed and see if your document has been listed or matched with its rightful owner. For your security, all personal details are blurred and remain protected until verification is complete
        </p>
        {/* <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Found: {foundDocs.length} documents</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Lost: {lostDocs.length} reports</span>
          </div>
        </div> */}
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
                <span>Found Documents</span>
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
                <span>Lost Reports</span>
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
              ? "Documents that have been found and reported by community members. Contact details are available after verification."
              : "Missing documents reported by their owners. Help reunite people with their important documents."
            }
          </p>
        </div>
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
              Previous
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
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, currentDocs.length)} of {currentDocs.length} documents
          </div>
        </div>
      )}

      {/* Enhanced Empty State */}
      {currentDocs.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {activeTab === "found" ? (
              <FileText className="w-12 h-12 text-gray-400" />
            ) : (
              <AlertCircle className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">
            No {activeTab} documents yet
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {activeTab === "found"
              ? "Be the first to help by reporting found documents. Every document returned makes a difference."
              : "No missing documents reported yet. Help spread the word about this service."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setActiveTab(activeTab === "found" ? "lost" : "found")}
              className="px-6 py-2 text-blue-600 hover:text-blue-800 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              View {activeTab === "found" ? "Lost Reports" : "Found Documents"}
            </button>
            <button 
              onClick={() => onTabChange(activeTab === "found" ? "upload-found" : "report-lost")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {activeTab === "found" ? "Report Found Document" : "Report Lost Document"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
