import { useState } from "react";
import { Search, Eye, Phone, Heart, Calendar, User, Hash, MapPin } from "lucide-react";
import axiosClient from "../api/axiosClient";

export default function SearchDocuments() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ lost: [], found: [] });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const [lostRes, foundRes] = await Promise.all([
        axiosClient.get(`lost/search/?search=${query}`),
        axiosClient.get(`found/search/?search=${query}`)
      ]);

      setResults({ lost: lostRes.data, found: foundRes.data });
    } catch (err) {
      console.error("Search error:", err);
      setResults({ lost: [], found: [] });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDocumentClick = (item, type) => {
    // Open document details in new tab
    window.open(`/document/${type}/${item.id}`, '_blank');
  };

  const handleActionClick = (e, item, type) => {
    e.stopPropagation(); // Prevent card click
    if (type === 'found') {
      // Navigate to claim process
      window.location.href = `/#claim-found-${item.id}`;
    } else {
      // Navigate to "I found this" process
      window.location.href = `/#found-lost-${item.id}`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Search Documents</h2>
        <p className="text-gray-600">Find lost or found documents by name, type, or ID number</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, document type, or ID number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching documents...</p>
        </div>
      )}

      {/* Results */}
      {!loading && (results.lost.length > 0 || results.found.length > 0) && (
        <div className="space-y-8">
          {/* Found Documents */}
          {results.found.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">📄</span>
                </div>
                Found Documents ({results.found.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.found.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleDocumentClick(item, 'found')}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group"
                  >
                    {/* Image */}
                    {item.image && (
                      <div className="h-40 bg-gray-100 overflow-hidden relative">
                        <img 
                          src={item.image} 
                          alt="Found document"
                          className="w-full h-full object-cover filter blur-sm group-hover:blur-none transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-medium">
                            🔒 Privacy Protected
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Found Document
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-gray-800 mb-3 text-lg">
                        {item.document_type?.name || item.document_type}
                      </h4>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {item.finder_name || "Name not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {item.document_number || "Number not provided"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {item.where_found || "Location not specified"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleDocumentClick(item, 'found')}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button
                          onClick={(e) => handleActionClick(e, item, 'found')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          Claim
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lost Documents */}
          {results.lost.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm">🔍</span>
                </div>
                Lost Reports ({results.lost.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.lost.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleDocumentClick(item, 'lost')}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        Lost Report
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-gray-800 mb-3 text-lg">
                      {item.document_type?.name || item.document_type}
                    </h4>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {item.owner_name || "Owner not specified"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {item.document_number || "Number not provided"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {item.where_lost || "Location not specified"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleDocumentClick(item, 'lost')}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      <button
                        onClick={(e) => handleActionClick(e, item, 'lost')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Heart className="w-3 h-3" />
                        Found It
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {!loading && results.lost.length === 0 && results.found.length === 0 && query && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No documents found</h3>
          <p className="text-gray-500">
            No documents match your search for "{query}". Try different keywords or check the spelling.
          </p>
        </div>
      )}
    </div>
  );
}
