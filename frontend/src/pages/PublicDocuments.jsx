import { useEffect, useState } from "react";
import { Search, Filter, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Recent Documents
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse recently reported and found documents. Personal information is protected for privacy.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-xl p-1 shadow-md border">
          <button
            onClick={() => setActiveTab("found")}
            className={`px-6 py-3 rounded-lg transition font-medium ${
              activeTab === "found"
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-600 hover:text-green-600 hover:bg-green-50"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>📄</span>
              <span>Found Documents</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {foundDocs.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("lost")}
            className={`px-6 py-3 rounded-lg transition font-medium ${
              activeTab === "lost"
                ? "bg-red-600 text-white shadow-sm"
                : "text-gray-600 hover:text-red-600 hover:bg-red-50"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>🔍</span>
              <span>Lost Reports</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                {lostDocs.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Documents Grid - 3x2 Layout */}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mb-8">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
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
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {currentDocs.length > 0 && (
        <div className="text-center text-sm text-gray-500 mb-8">
          Showing {startIndex + 1}-{Math.min(endIndex, currentDocs.length)} of {currentDocs.length} documents
        </div>
      )}

      {/* Empty State */}
      {currentDocs.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">
            {activeTab === "found" ? "📄" : "🔍"}
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No {activeTab} documents yet
          </h3>
          <p className="text-gray-500 mb-6">
            {activeTab === "found"
              ? "No found documents have been reported yet."
              : "No lost documents have been reported yet."}
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => setActiveTab(activeTab === "found" ? "lost" : "found")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View {activeTab === "found" ? "Lost Reports" : "Found Documents"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
