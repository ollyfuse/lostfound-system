import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { 
  HelpCircle, Search, FileText, Upload, Eye, Phone, Shield, 
  ChevronDown, ChevronRight, Mail, MapPin, CheckCircle,
  AlertCircle, Heart, User, Camera, Crown
} from "lucide-react";

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { id: "getting-started", name: "Getting Started", icon: HelpCircle },
    { id: "reporting", name: "Reporting Documents", icon: FileText },
    { id: "uploading", name: "Uploading Found", icon: Upload },
    { id: "verification", name: "Verification & Claims", icon: Shield },
    { id: "premium", name: "Premium Features", icon: Crown },
    { id: "privacy", name: "Privacy & Security", icon: Eye },
    { id: "troubleshooting", name: "Troubleshooting", icon: AlertCircle }
  ];

  const helpContent = {
    "getting-started": {
      title: "Getting Started with DocuFind",
      description: "Learn the basics of using our platform",
      sections: [
        {
          title: "How DocuFind Works",
          content: (
            <div className="space-y-4">
              <p className="text-gray-600">DocuFind Rwanda helps reunite people with their lost documents through a secure, privacy-protected platform.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <FileText className="w-8 h-8 text-red-600 mb-2" />
                  <h4 className="font-semibold text-red-800">1. Report Lost</h4>
                  <p className="text-sm text-red-600">Submit details about your missing document</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <Heart className="w-8 h-8 text-green-600 mb-2" />
                  <h4 className="font-semibold text-green-800">2. Upload Found</h4>
                  <p className="text-sm text-green-600">Help others by uploading documents you've found</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-blue-800">3. Get Matched</h4>
                  <p className="text-sm text-blue-600">We'll notify you when there's a potential match</p>
                </div>
              </div>
            </div>
          )
        },
        {
          title: "Browsing Documents",
          content: (
            <div className="space-y-3">
              <p className="text-gray-600">Use the Browse Documents tab to view recent reports:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <Search className="w-4 h-4 mt-1 text-blue-600" />
                  <span>Use the search bar to find specific documents by name, type, or ID number</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 mt-1 text-blue-600" />
                  <span>Click "Details" to view more information about any document</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-1 text-blue-600" />
                  <span>Use "Claim" or "Found It" buttons to start the reunion process</span>
                </li>
              </ul>
            </div>
          )
        }
      ]
    },
    "reporting": {
      title: "Reporting Lost Documents",
      description: "Step-by-step guide to report your lost documents",
      sections: [
        {
          title: "Required Information",
          content: (
            <div className="space-y-3">
              <p className="text-gray-600">To report a lost document, you'll need to provide:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-4 h-4" /> Personal Information
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1 ml-6">
                    <li>• Full name (required)</li>
                    <li>• Email address (required)</li>
                    <li>• Phone number (optional)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Document Details
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1 ml-6">
                    <li>• Document type (required)</li>
                    <li>• Document number (optional)</li>
                    <li>• Issue date (optional)</li>
                    <li>• Document photo (optional)</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: "Privacy Protection",
          content: (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h5 className="font-semibold text-blue-800">Your Information is Protected</h5>
                  <p className="text-sm text-blue-600 mt-1">
                    Only partial details are visible to others. Full information is shared only after successful verification.
                  </p>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    "uploading": {
      title: "Uploading Found Documents",
      description: "Help someone recover their document",
      sections: [
        {
          title: "Upload Process",
          content: (
            <div className="space-y-4">
              <p className="text-gray-600">When you find a document, help reunite it with its owner:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Camera className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold">1. Take a Photo</h5>
                    <p className="text-sm text-gray-600">Upload a clear photo of the document. Sensitive information will be automatically blurred.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold">2. Document Details</h5>
                    <p className="text-sm text-gray-600">Select document type and enter any visible information like name or ID number.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold">3. Location & Contact</h5>
                    <p className="text-sm text-gray-600">Provide where you found it and your contact information for the owner to reach you.</p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    "verification": {
      title: "Verification & Claims",
      description: "How to verify ownership and claim documents",
      sections: [
        {
          title: "Claiming a Found Document",
          content: (
            <div className="space-y-3">
              <p className="text-gray-600">To claim a document that belongs to you:</p>
              <ol className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">1</span>
                  <span>Click the "Claim" button on the found document</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">2</span>
                  <span>Fill out the claim form with your contact information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">3</span>
                  <span>Provide proof of ownership (document number, personal details)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">4</span>
                  <span>Wait for verification and contact from the finder</span>
                </li>
              </ol>
            </div>
          )
        },
        {
          title: "Image Verification",
          content: (
            <div className="space-y-3">
              <p className="text-gray-600">To view unblurred document images:</p>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-amber-600 mt-1" />
                  <div>
                    <h5 className="font-semibold text-amber-800">Verification Required</h5>
                    <p className="text-sm text-amber-600 mt-1">
                      Enter the document number or owner name to verify ownership and view the unblurred image for 3 seconds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    "premium": {
      title: "Premium Features",
      description: "Boost your document's visibility",
      sections: [
        {
          title: "Premium Listing Benefits",
          content: (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  <h5 className="font-semibold text-yellow-800">Premium Features</h5>
                </div>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Priority placement in search results</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Special premium badge highlighting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Enhanced visibility to potential finders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Faster matching notifications</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-600 text-sm">
                <strong>Cost:</strong> 500 RWF via MTN MoMo • <strong>Duration:</strong>7 days
              </p>
            </div>
          )
        }
      ]
    },
    "privacy": {
      title: "Privacy & Security",
      description: "How we protect your information",
      sections: [
        {
          title: "Data Protection",
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600 mb-2" />
                  <h5 className="font-semibold text-green-800">Information Masking</h5>
                  <p className="text-sm text-green-600">Names and document numbers are partially hidden from public view</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600 mb-2" />
                  <h5 className="font-semibold text-blue-800">Image Blurring</h5>
                  <p className="text-sm text-blue-600">Document photos are blurred until ownership is verified</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                We comply with Rwanda's Data Protection and Privacy Law No. 058/2021. 
                Read our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> for full details.
              </p>
            </div>
          )
        }
      ]
    },
    "troubleshooting": {
      title: "Troubleshooting",
      description: "Common issues and solutions",
      sections: [
        {
          title: "Common Issues",
          content: (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-2">Upload Failed</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check your internet connection</li>
                    <li>• Ensure image is under 10MB</li>
                    <li>• Use JPG or PNG format only</li>
                    <li>• Fill all required fields</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-2">Can't Find My Document</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Try different search terms</li>
                    <li>• Check both Lost and Found sections</li>
                    <li>• Search by document type instead of name</li>
                    <li>• Documents may take time to appear</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-2">Verification Not Working</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Enter exact document number</li>
                    <li>• Try full name as it appears on document</li>
                    <li>• Check spelling and spacing</li>
                    <li>• Contact support if issues persist</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        }
      ]
    }
  };

  const faqs = [
    {
      question: "Is DocuFind free to use?",
      answer: "Yes, basic features are completely free. Premium features cost 500 RWF for enhanced visibility."
    },
    {
      question: "How long do documents stay on the platform?",
      answer: "Documents remain active until marked as found or removed by the user. We periodically clean up old entries."
    },
    {
      question: "Can I edit my report after submitting?",
      answer: "Currently, you cannot edit reports directly. Contact support if you need to make changes to your submission."
    },
    {
      question: "What types of documents are supported?",
      answer: "We support all official documents including National IDs, passports, driving licenses, student IDs, and more."
    },
    {
      question: "How do I know if someone found my document?",
      answer: "You'll receive email notifications when there's a potential match or when someone claims your document."
    },
    {
      question: "Is my personal information safe?",
      answer: "Yes, we use data masking and image blurring to protect sensitive information. Full details are only shared after verification."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8">
                <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                <ArrowLeft className="w-4 h-4" />
                Back
                </button>
            </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Help Center</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and learn how to use DocuFind effectively
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-8">
              <h3 className="font-semibold text-gray-800 mb-4">Categories</h3>
              <nav className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Current Category Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <h2 className="text-2xl font-bold">{helpContent[activeCategory].title}</h2>
                <p className="text-blue-100 mt-1">{helpContent[activeCategory].description}</p>
              </div>
              
              <div className="p-6 space-y-8">
                {helpContent[activeCategory].sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{section.title}</h3>
                    {section.content}
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Frequently Asked Questions</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800">{faq.question}</span>
                        {expandedFaq === index ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white p-6">
              <h3 className="text-xl font-semibold mb-4">Still Need Help?</h3>
              <p className="text-green-100 mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">support@docufind.rw</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Kigali, Rwanda</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
