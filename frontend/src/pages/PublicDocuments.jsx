import { useEffect, useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import axiosClient from "../api/axiosClient";
import DocumentCard from "../components/DocumentCard";

export default function PublicDocuments() {
  const [lostDocs, setLostDocs] = useState([]);
  const [foundDocs, setFoundDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("found");

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

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Found Documents</h3>
              <p className="text-2xl font-bold text-green-600">{foundDocs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-full">
              <Search className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800">Lost Reports</h3>
              <p className="text-2xl font-bold text-red-600">{lostDocs.length}</p>
            </div>
          </div>
        </div>
      </div> */}

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

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {activeTab === "found" &&
          foundDocs.map((doc) => (
            <DocumentCard key={doc.id} document={doc} type="found" />
          ))}
        {activeTab === "lost" &&
          lostDocs.map((doc) => (
            <DocumentCard key={doc.id} document={doc} type="lost" />
          ))}
      </div>

      {/* Empty State */}
      {((activeTab === "found" && foundDocs.length === 0) ||
        (activeTab === "lost" && lostDocs.length === 0)) && (
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
