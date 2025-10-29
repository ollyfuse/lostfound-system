import { FileText, Mail, MapPin, Calendar, Scale, Users, Shield } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Terms of Service</h1>
                <p className="text-green-100">DocuFind Rwanda</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-green-100">
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
              <p className="text-gray-600 leading-relaxed mb-3">
                Welcome to DocuFind Rwanda ("we," "our," or "us").
              </p>
              <p className="text-gray-600 leading-relaxed mb-3">
                By accessing or using our platform, you agree to comply with and be bound by these Terms of Service ("Terms"). If you do not agree, please do not use DocuFind Rwanda.
              </p>
              <p className="text-gray-600 leading-relaxed">
                These Terms govern your access to and use of our website and services that help users report, find, and reunite lost or found personal documents.
              </p>
            </section>

            {/* Purpose */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Purpose of the Platform</h2>
              <p className="text-gray-600 mb-4">DocuFind Rwanda is a digital system that allows individuals to:</p>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Report lost documents (such as IDs, passports, or licenses), or</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Report found documents for safe and verified return to the rightful owner.</span>
                </li>
              </ul>
              <p className="text-gray-600">All personal information shared is handled according to our Privacy Policy.</p>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-600 mb-4">By using our platform, you agree to:</p>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <span>Provide accurate and truthful information when reporting lost or found documents.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <span>Avoid uploading false, misleading, or confidential information that does not belong to you.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <span>Not use the platform for fraudulent, abusive, or illegal activities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <span>Respect the privacy and rights of other users.</span>
                </li>
              </ul>
              <p className="text-gray-600 font-semibold">You are solely responsible for any data or content you submit to DocuFind Rwanda.</p>
            </section>

            {/* Verification */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Verification and Publication</h2>
              <p className="text-gray-600 mb-4">All submissions are subject to review and moderation. We may:</p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Verify the authenticity of the document report.</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Edit or remove reports that contain sensitive or inappropriate data.</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Blur or hide personal information until verification is complete.</span>
                </div>
              </div>
              <p className="text-gray-600 mt-4 text-sm">Publication of a report does not guarantee ownership or authenticity — it is only for matching and awareness purposes.</p>
            </section>

            {/* Matching */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Matching and Communication</h2>
              <p className="text-gray-600 mb-4">When a document is matched:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>We may contact the finder or owner using the contact details provided.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Certain verified details may be shared between both parties to facilitate recovery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>DocuFind Rwanda acts only as a facilitator, not a guarantor, of successful reunion.</span>
                </li>
              </ul>
            </section>

            {/* Payments */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Payments (if applicable)</h2>
              <p className="text-gray-600 mb-3">
                If you use paid features (e.g., viewing finder contact info, premium listing, or bulk listing), all payments are processed securely through MTN MoMo.
              </p>
              <p className="text-gray-600 font-semibold">Fees are non-refundable unless otherwise stated.</p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">DocuFind Rwanda provides this service "as is", without any warranty or guarantee of results.</p>
              <p className="text-gray-600 mb-4">We are not responsible for:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>False or misleading information submitted by users,</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Loss or damage resulting from reliance on content published here, or</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Unauthorized use of the service.</span>
                </li>
              </ul>
              <p className="text-gray-600 mt-4 font-semibold">Your use of the platform is entirely at your own risk.</p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Governing Law</h2>
              <p className="text-gray-600 mb-3">These Terms are governed by the laws of the Republic of Rwanda.</p>
              <p className="text-gray-600">Any disputes shall be handled through competent Rwandan courts.</p>
            </section>

            {/* Contact */}
            <section className="bg-green-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Contact Us</h2>
              <p className="text-gray-600 mb-4">If you have any questions or concerns about these Terms, please contact:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-green-600" />
                  <span>support@docufind.rw</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-green-600" />
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
