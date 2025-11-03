import { 
  FileText, Upload, Search, Phone, CheckCircle, Shield, 
  ArrowRight, Clock, Mail, Eye, Heart, User, Crown
} from "lucide-react";
import { ArrowLeft } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Report or Upload",
      description: "Lost something? Report it. Found something? Upload it.",
      icon: FileText,
      color: "blue",
      details: [
        "Fill out a simple form with document details",
        "Upload photos (automatically privacy-protected)",
        "Provide contact information for matching"
      ]
    },
    {
      id: 2,
      title: "Smart Matching",
      description: "Our system automatically matches lost and found documents.",
      icon: Search,
      color: "purple",
      details: [
        "AI-powered matching based on document type, location, and details",
        "Instant notifications when potential matches are found",
        "Privacy-first approach with masked information"
      ]
    },
    {
      id: 3,
      title: "Secure Verification",
      description: "Verify ownership through our secure process.",
      icon: Shield,
      color: "green",
      details: [
        "Document number or personal detail verification",
        "Temporary image unblurring for confirmation",
        "Direct contact facilitation between parties"
      ]
    },
    {
      id: 4,
      title: "Happy Reunion",
      description: "Get your document back safely and securely.",
      icon: CheckCircle,
      color: "emerald",
      details: [
        "Coordinate safe meetup through our platform",
        "Mark document as successfully returned",
        "Help build a stronger community"
      ]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Personal information is masked and images are blurred until verification"
    },
    {
      icon: Clock,
      title: "Fast Matching",
      description: "Automated matching system works 24/7 to find potential matches"
    },
    {
      icon: Mail,
      title: "Email Notifications",
      description: "Get notified immediately when there's a potential match"
    },
    {
      icon: Crown,
      title: "Premium Options",
      description: "Boost visibility with premium features for faster results"
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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            How DocuFind Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our simple 4-step process helps reunite people with their important documents 
            while keeping personal information secure and private.
          </p>
        </div>

        {/* Main Process Steps */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              
              return (
                <div key={step.id} className="relative">
                  {/* Step Card */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-full">
                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-full bg-${step.color}-100 flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${step.color}-600`} />
                      </div>
                      <div className={`w-8 h-8 rounded-full bg-${step.color}-600 text-white flex items-center justify-center font-bold text-sm`}>
                        {step.id}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    
                    {/* Details */}
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arrow (desktop only) */}
                  {!isLast && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="bg-white rounded-full p-2 shadow-md border border-gray-200">
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Two-Path Explanation */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Two Ways to Help
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lost Document Path */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8 border border-red-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-600 p-3 rounded-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-800">Lost Your Document?</h3>
                  <p className="text-red-600">Report it and we'll help you find it</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-red-800">Fill Report Form</h4>
                    <p className="text-sm text-red-600">Provide document details, where you lost it, and your contact info</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-red-800">Wait for Matches</h4>
                    <p className="text-sm text-red-600">We'll notify you if someone uploads a matching document</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-red-800">Claim & Verify</h4>
                    <p className="text-sm text-red-600">Verify ownership and coordinate pickup with the finder</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Found Document Path */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-green-600 p-3 rounded-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-800">Found a Document?</h3>
                  <p className="text-green-600">Help someone get their document back</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-green-800">Upload Photo</h4>
                    <p className="text-sm text-green-600">Take a photo - sensitive info is automatically blurred for privacy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-green-800">Add Details</h4>
                    <p className="text-sm text-green-600">Enter document type, where you found it, and your contact info</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-green-800">Help Reunite</h4>
                    <p className="text-sm text-green-600">We'll match it with lost reports and facilitate the return</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose DocuFind?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white p-8 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Privacy First Approach</h2>
            </div>
            <p className="text-blue-100 mb-6 text-lg">
              Your personal information is protected at every step of the process
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/10 rounded-lg p-4">
                <Eye className="w-6 h-6 mb-2" />
                <h4 className="font-semibold mb-1">Image Blurring</h4>
                <p className="text-sm text-blue-100">Document photos are automatically blurred to hide sensitive information</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <User className="w-6 h-6 mb-2" />
                <h4 className="font-semibold mb-1">Data Masking</h4>
                <p className="text-sm text-blue-100">Names and ID numbers are partially hidden from public view</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 mb-2" />
                <h4 className="font-semibold mb-1">Verified Access</h4>
                <p className="text-sm text-blue-100">Full details only shared after ownership verification</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of people helping each other recover important documents
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              Report Lost Document
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Found Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
