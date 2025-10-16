import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VerifyClaim() {
  const query = useQuery();
  const token = query.get("token");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Missing verification token");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await axiosClient.get(`claims/verify/?token=${token}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your claim...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Failed</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <a 
              href="/" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-50 border-b border-green-200 p-6">
            <div className="flex items-center">
              <div className="text-green-500 text-3xl mr-4">✅</div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">Verification Successful!</h1>
                <p className="text-green-600">You can now view the full document details.</p>
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Document Info */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Document Information</h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">Type:</span>
                    <span className="ml-2">{data.document_type?.name || data.document_type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Name:</span>
                    <span className="ml-2">{data.Owner_name || data.found_name}</span>
                  </div>
                  {data.document_number && (
                    <div>
                      <span className="font-medium text-gray-600">Document Number:</span>
                      <span className="ml-2 font-mono">{data.document_number}</span>
                    </div>
                  )}
                  {data.description && (
                    <div>
                      <span className="font-medium text-gray-600">Description:</span>
                      <span className="ml-2">{data.description}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              {data.contact && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Information</h2>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-blue-800">Name:</span>
                        <span className="ml-2">{data.contact.full_name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Phone:</span>
                        <span className="ml-2">{data.contact.phone}</span>
                      </div>
                      {data.contact.email && (
                        <div>
                          <span className="font-medium text-blue-800">Email:</span>
                          <span className="ml-2">{data.contact.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Original Image */}
            {data.image_original && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Original Document Image</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <img 
                    src={data.image_original} 
                    alt="Original document" 
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">📞 Next Steps</h3>
              <p className="text-yellow-700">
                Please contact the person listed above to arrange safe retrieval of your document. 
                We recommend meeting in a public place for your safety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
