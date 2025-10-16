
import { useState } from "react";
import axiosClient from "../api/axiosClient";
import ClaimForm from "./ClaimForm";

export default function SearchDocuments() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ lost: [], found: [] });
  const [loading, setLoading] = useState(false);
  const [claimingDoc, setClaimingDoc] = useState(null); // Track which document is being claimed

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

  const handleClaimClick = (docId, docType) => {
    setClaimingDoc(claimingDoc === `${docType}-${docId}` ? null : `${docType}-${docId}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search by name or document number..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border p-2 rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-600">Searching...</p>}

      {!loading && (results.lost.length || results.found.length) > 0 && (
        <div className="mt-6 space-y-6">
          {results.found.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-700 mb-4">Found Documents</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.found.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg overflow-hidden bg-green-50 shadow-sm"
                  >
                    {/* Blurred Image */}
                    {item.image && (
                      <div className="h-48 bg-gray-200 overflow-hidden relative">
                        <img 
                          src={item.image} 
                          alt="Found document (blurred for privacy)"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <span className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
                            🔒 Blurred for Privacy
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Document Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          📄 Found
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {item.document_type?.name || item.document_type}
                      </h4>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p><span className="font-medium">Name:</span> {item.finder_name}</p>
                        <p><span className="font-medium">Number:</span> {item.document_number || "N/A"}</p>
                      </div>
                      
                      <button 
                        onClick={() => handleClaimClick(item.id, 'found')}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        {claimingDoc === `found-${item.id}` ? "Cancel" : "Claim This Document"}
                      </button>

                      {/* Claim Form */}
                      {claimingDoc === `found-${item.id}` && (
                        <div className="mt-4">
                          <ClaimForm reportType="found" reportId={item.id} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.lost.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-700 mb-4">Lost Reports</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.lost.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 bg-red-50 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        🔍 Lost
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {item.document_type?.name || item.document_type}
                    </h4>
                    
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <p><span className="font-medium">Owner:</span> {item.owner_name}</p>
                      <p><span className="font-medium">Number:</span> {item.document_number || "N/A"}</p>
                    </div>
                    
                    <button 
                      onClick={() => handleClaimClick(item.id, 'lost')}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      {claimingDoc === `lost-${item.id}` ? "Cancel" : "I Found This"}
                    </button>

                    {/* Claim Form */}
                    {claimingDoc === `lost-${item.id}` && (
                      <div className="mt-4">
                        <ClaimForm reportType="lost" reportId={item.id} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && results.lost.length === 0 && results.found.length === 0 && query && (
        <div className="mt-6 text-center text-gray-500">
          <p>No documents found matching "{query}"</p>
        </div>
      )}
    </div>
  );
}
