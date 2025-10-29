import { Shield, Mail, MapPin, Calendar, FileText } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Privacy Policy</h1>
                <p className="text-blue-100">DocuFind Rwanda</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Effective: January 2025</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>Last Updated: January 2025</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                DocuFind Rwanda ("we," "our," or "us") is a digital platform that helps people in Rwanda reunite with their lost or found personal documents in a secure and lawful way. We respect your privacy and handle all personal data in accordance with Rwanda's Data Protection and Privacy Law No. 058/2021 of 13 October 2021.
              </p>
              <p className="text-gray-600 leading-relaxed mt-3">
                By using our website or submitting any information, you agree to this Privacy Policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Information We Collect</h2>
              <p className="text-gray-600 mb-4">We may collect the following information when you use DocuFind Rwanda:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Personal identification:</strong> name, national ID number (if you provide it), contact number, or email.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Document details:</strong> document type, serial number, photo image, or description of the lost/found item.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Technical data:</strong> IP address, browser type, and usage information (for site analytics).</span>
                </li>
              </ul>
              <p className="text-gray-600 mt-4">We do not collect financial information or unrelated personal data.</p>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">Your information is used only for the following purposes:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>To publish and manage lost or found document reports.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>To verify and match documents with their rightful owners.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>To communicate with users who submit or claim documents.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>To improve our services and maintain platform security.</span>
                </li>
              </ul>
              <p className="text-gray-600 mt-4 font-semibold">We will never sell, rent, or share your data with third parties for marketing.</p>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-600 mb-4">We may share limited data only when necessary:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>With authorized agencies (e.g., law enforcement or ID authorities) for verification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>With the owner or finder of a document once proper verification is completed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>With service providers that host our servers or handle email delivery, under strict confidentiality agreements.</span>
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Data Security</h2>
              <p className="text-gray-600 mb-4">We use reasonable technical and organizational measures to protect your data, including:</p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Encrypted connections (HTTPS and secure storage)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Limited access to authorized staff only</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Regular system updates and backups</span>
                </div>
              </div>
              <p className="text-gray-600 mt-4 text-sm">However, no online service can guarantee 100% security. You use DocuFind Rwanda at your own risk.</p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Your Rights Under Rwandan Law</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Access your personal data held by us.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Request correction or deletion of inaccurate information.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Withdraw consent for data processing at any time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Lodge a complaint with the Data Protection Office if you believe your rights are violated.</span>
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contact Us</h2>
              <p className="text-gray-600 mb-4">If you have any questions or requests related to this policy, please contact us at:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>privacy@docufind.rw</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Kigali, Rwanda</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
