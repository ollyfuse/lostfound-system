import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Search, Plus, Upload, FileText, Heart, X } from "lucide-react";
import LostDocumentForm from "./components/LostDocumentForm";
import FoundDocumentForm from "./components/FoundDocumentForm";
import DocumentCard from "./components/DocumentCard";
import PublicDocuments from "./pages/PublicDocuments";
import DocumentDetails from "./pages/DocumentDetail"; 
import axiosClient from "./api/axiosClient";
import Footer from "./components/Footer";
import RemoveDocument from "./pages/RemoveDocument";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import HelpCenter from "./components/HelpCenter";
import HowItWorks from "./components/HowItWorks";
import ContactUs from "./components/ContactUs";

function SearchOverlay({ isOpen, onClose, searchQuery, setSearchQuery, handleTabChange }) {
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
                     <div key={doc.id} className="transform scale-90 cursor-pointer" onClick={() => {
                          onClose(); 
                          handleTabChange("browse"); 
                          setTimeout(() => {
                            const element = document.getElementById(`document-${doc.id}`);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              element.classList.add('ring-4', 'ring-blue-400', 'ring-opacity-75');
                              element.style.transition = 'all 0.3s ease';
                              setTimeout(() => {
                                element.classList.remove('ring-4', 'ring-blue-400', 'ring-opacity-75');
                              }, 3000);
                            }
                          }, 500);
                        }}>
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
                     <div key={doc.id} className="transform scale-90 cursor-pointer" onClick={() => {
                          onClose(); // Close search overlay
                          handleTabChange("browse");
                          setTimeout(() => {
                            // Switch to lost tab first
                            window.location.hash = 'lost-tab';
                            setTimeout(() => {
                              const element = document.getElementById(`document-${doc.id}`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                element.classList.add('ring-4', 'ring-red-400', 'ring-opacity-75');
                                element.style.transition = 'all 0.3s ease';
                                setTimeout(() => {
                                  element.classList.remove('ring-4', 'ring-red-400', 'ring-opacity-75');
                                }, 3000);
                              }
                            }, 200);
                          }, 500);
                        }}>
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
        <section className="bg-gradient-to-r from-blue-600 to-green-600 py-8">
          <div className="max-w-6xl mx-auto px-4">         
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
              <div className="group">
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-5 rounded-full group-hover:bg-white/30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-4xl font-bold text-white mb-2">{stats.total_matched}+</h4>
                <p className="text-xl font-semibold text-white mb-1">Documents Reunited</p>
                <p className="text-blue-100">Successfully returned to owners</p>
              </div>

              <div className="group">
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-5 rounded-full group-hover:bg-white/30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-4xl font-bold text-white mb-2">{stats.total_lost + stats.total_found}+</h4>
                <p className="text-xl font-semibold text-white mb-1">Active Reports</p>
                <p className="text-blue-100">Community members helping</p>
              </div>

              <div className="group">
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-5 rounded-full group-hover:bg-white/30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-4xl font-bold text-white mb-2">{stats.success_rate}%</h4>
                <p className="text-xl font-semibold text-white mb-1">Success Rate</p>
                <p className="text-blue-100">Documents successfully matched</p>
              </div>
            </div>
          </div>
        </section>


      {/* === Enhanced Navigation Tabs === */}
<section className="py-12 bg-white">
  <div className="max-w-5xl mx-auto px-4">
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">What would you like to do?</h3>
      <p className="text-gray-600">Choose an option below to get started</p>
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
              <div className="font-semibold">Browse Documents</div>
              <div className={`text-sm ${
                activeTab === "browse" ? "text-blue-100" : "text-gray-500"
              }`}>
                View recent reports
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
              <div className="font-semibold">Report Lost</div>
              <div className={`text-sm ${
                activeTab === "report-lost" ? "text-red-100" : "text-gray-500"
              }`}>
                Missing document?
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
              <div className="font-semibold">Upload Found</div>
              <div className={`text-sm ${
                activeTab === "upload-found" ? "text-green-100" : "text-gray-500"
              }`}>
                Found something?
              </div>
            </div>
          </button>
        </div>
      </div>
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
        handleTabChange={handleTabChange}
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
        <Route path="/remove-document" element={<RemoveDocument />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}
