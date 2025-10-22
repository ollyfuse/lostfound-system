import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Search, Plus, Upload, FileText, Heart, X } from "lucide-react";
import LostDocumentForm from "./components/LostDocumentForm";
import FoundDocumentForm from "./components/FoundDocumentForm";
import DocumentCard from "./components/DocumentCard";
import PublicDocuments from "./pages/PublicDocuments";
import DocumentDetails from "./pages/DocumentDetail"; // Your payment-gated component
import axiosClient from "./api/axiosClient";
import Footer from "./components/Footer";

function SearchOverlay({ isOpen, onClose, searchQuery, setSearchQuery }) {
  const [results, setResults] = useState({ lost: [], found: [] });
  const [loading, setLoading] = useState(false);

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

  const totalResults = results.lost.length + results.found.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className="relative bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Search Documents</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, document type, or ID number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none px-3 text-gray-700"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="p-6 overflow-y-auto max-h-96">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching...</p>
            </div>
          )}

          {!loading && searchQuery && totalResults === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No documents found
              </h3>
              <p className="text-gray-500">
                No documents match your search for "{searchQuery}"
              </p>
            </div>
          )}

          {!loading && searchQuery && totalResults > 0 && (
            <div>
              <div className="mb-4">
                <p className="text-gray-600">
                  Found {totalResults} document{totalResults !== 1 ? 's' : ''}
                </p>
              </div>

              {results.found.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-green-700 mb-3">
                    Found Documents ({results.found.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.found.slice(0, 4).map((doc) => (
                      <div key={doc.id} className="transform scale-90">
                        <DocumentCard document={doc} type="found" />
                      </div>
                    ))}
                  </div>
                  {results.found.length > 4 && (
                    <p className="text-sm text-gray-500 mt-2">
                      And {results.found.length - 4} more found documents...
                    </p>
                  )}
                </div>
              )}

              {results.lost.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-700 mb-3">
                    Lost Reports ({results.lost.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.lost.slice(0, 4).map((doc) => (
                      <div key={doc.id} className="transform scale-90">
                        <DocumentCard document={doc} type="lost" />
                      </div>
                    ))}
                  </div>
                  {results.lost.length > 4 && (
                    <p className="text-sm text-gray-500 mt-2">
                      And {results.lost.length - 4} more lost reports...
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
                Start typing to search
              </h3>
              <p className="text-gray-500">
                Search for documents by name, type, or ID number
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [stats, setStats] = useState({
  total_matched: 250,
  total_lost: 500,
  success_rate: 98
});
  useEffect(() => {
      const fetchStats = async () => {
        try {
          const response = await axiosClient.get('stats/');
          setStats(response.data);
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        }
      };

      fetchStats();
    }, []);

  const handleSearchFocus = () => {
    setShowSearchOverlay(true);
  };

  const handleCloseSearch = () => {
    setShowSearchOverlay(false);
    setSearchQuery("");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "browse":
        return <PublicDocuments onTabChange={handleTabChange}/>;
      case "report-lost":
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              Report Lost Document
            </h2>
            <h4 className="text-1xl text-center mb-6 text-gray-400">
            Provide details about your lost document to help others identify and contact you.

            </h4>
            <LostDocumentForm />
          </div>
        );
      case "upload-found":
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              Upload Found Document
            </h2>
            <h4 className="text-1xl text-center mb-6 text-gray-400">Help someone recover their important document by uploading what you found.</h4>
            <FoundDocumentForm />
          </div>
        );
      default:
        return <PublicDocuments onTabChange={handleTabChange}/>;
    }
  };

  const handleTabChange = (tab) => {
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
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col">
      {/* === NAVBAR === */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-blue-500 p-2 rounded-lg">
              <FileText className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800 leading-tight">
                DocuFind
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                Lost & Found Documents
              </p>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-xl w-full">
            <div 
              onClick={handleSearchFocus}
              className="flex items-center bg-[#f1f3f6] rounded-full px-4 py-2 shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-100 transition"
            >
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, document type, or ID number..."
                className="flex-1 bg-transparent outline-none px-2 text-gray-700 text-sm cursor-pointer"
                readOnly
              />
            </div>
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleTabChange("report-lost")}
              className="flex items-center space-x-1 border border-gray-300 text-gray-700 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Report Lost</span>
            </button>
            <button
              onClick={() => handleTabChange("upload-found")}
              className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-2 rounded-md transition"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Found</span>
            </button>
          </div>
        </div>
      </header>

      {/* === HERO SECTION === */}
      <main className="flex-grow">
        <section className="text-center py-16 bg-gradient-to-b from-[#e8f2ff] to-[#f7f9fc]">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
            Reuniting People with Their{" "}
            <span className="text-blue-600">Important Documents</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600 text-base md:text-lg">
            A secure platform where you can report lost documents and help
            others find theirs. Your privacy is protected while making recovery
            possible.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-3">
            <button
              onClick={() => handleTabChange("report-lost")}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-md transition shadow-sm"
            >
              <FileText className="w-5 h-5 mr-2" />
              Report Lost Document
            </button>
            <button
              onClick={() => handleTabChange("upload-found")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-3 rounded-md transition shadow-sm"
            >
              <Heart className="w-5 h-5 mr-2" />
              Help Someone Find Theirs
            </button>
          </div>
        </section>

        {/* === Statistics Section === */}
        <section className="bg-green-200 py-6">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-2">
                <div className="bg-blue-100 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 1.1-.9 2-2 2s-2-.9-2-2m8 0c0 1.1-.9 2-2 2s-2-.9-2-2m0 10c4.418 0 8-3.582 8-8 0-4.418-3.582-8-8-8S4 8.582 4 13c0 4.418 3.582 8 8 8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">{stats.total_matched}+</h3>
              <p className="text-gray-600">Documents Reunited</p>
            </div>

            <div>
              <div className="flex justify-center mb-2">
                <div className="bg-green-100 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c3.042 0 5.824 1.07 7.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">{stats.total_lost + stats.total_found}+</h3>
              <p className="text-gray-600">Active Documents</p>
            </div>

            <div>
              <div className="flex justify-center mb-2">
                <div className="bg-pink-100 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">{stats.success_rate}%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </section>

        {/* === Navigation Tabs === */}
        <section className="py-10 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex bg-gray-100 rounded-xl p-1">
              <button 
                onClick={() => handleTabChange("browse")}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  activeTab === "browse" 
                    ? "bg-white shadow text-gray-800" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Browse
              </button>
              <button 
                onClick={() => handleTabChange("report-lost")}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  activeTab === "report-lost" 
                    ? "bg-white shadow text-gray-800" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Report Lost
              </button>
              <button 
                onClick={() => handleTabChange("upload-found")}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  activeTab === "upload-found" 
                    ? "bg-white shadow text-gray-800" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Upload Found
              </button>
            </div>
          </div>
        </section>

        {/* Dynamic Content Section */}
        <section id="content-section" className="py-8">
          {renderContent()}
        </section>
      </main>

      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={showSearchOverlay}
        onClose={handleCloseSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

       <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify" element={<DocumentDetails />} />
      </Routes>
    </Router>
  );
}
