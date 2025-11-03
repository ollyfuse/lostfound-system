// Create: /Users/admin/Documents/projects/lostfound/frontend/src/components/ContactUs.jsx
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, Bug } from "lucide-react";
import axiosClient from "../api/axiosClient";
import { ArrowLeft } from "lucide-react";


export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "general", label: "General Inquiry", icon: MessageCircle },
    { value: "support", label: "Technical Support", icon: HelpCircle },
    { value: "bug", label: "Report a Bug", icon: Bug },
    { value: "feedback", label: "Feedback & Suggestions", icon: MessageCircle }
  ];

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setStatus({ type: "info", message: "Sending your message..." });

  try {
    const response = await axiosClient.post("contact/", {
      name: form.name,
      email: form.email,
      category: form.category,
      subject: form.subject,
      message: form.message
    });

    setStatus({ 
      type: "success", 
      message: response.data.detail || " Message sent successfully! We'll get back to you within 24 hours." 
    });
    setForm({ name: "", email: "", subject: "", category: "", message: "" });
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to send message. Please try again or contact us directly.";
    setStatus({ 
      type: "error", 
      message: errorMessage
    });
  } finally {
    setLoading(false);
  }
};

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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions, feedback, or need help? We're here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Cards */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Email</h4>
                    <p className="text-gray-600 text-sm">support@docufind.rw</p>
                    <p className="text-gray-500 text-xs">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Phone</h4>
                    <p className="text-gray-600 text-sm">+250 780 286 626</p>
                    <p className="text-gray-500 text-xs">Mon-Fri, 8AM-6PM EAT</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Location</h4>
                    <p className="text-gray-600 text-sm">Kigali, Rwanda</p>
                    <p className="text-gray-500 text-xs">East Africa Time (EAT)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Business Hours</h4>
                    <p className="text-gray-600 text-sm">Monday - Friday</p>
                    <p className="text-gray-500 text-xs">8:00 AM - 6:00 PM EAT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Help */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Need Quick Help?</h3>
              <p className="text-blue-600 text-sm mb-4">
                Check our Help Center for instant answers to common questions.
              </p>
              <a 
                href="/help" 
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Visit Help Center
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInput}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInput}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInput}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleInput}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Brief description of your inquiry"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleInput}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    placeholder="Please provide as much detail as possible..."
                    required
                  />
                </div>

                {/* Status Message */}
                {status.type && (
                  <div className={`p-4 rounded-lg ${
                    status.type === "error" 
                      ? "bg-red-50 text-red-700 border border-red-200" 
                      : status.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}>
                    {status.message}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Common Questions</h2>
            <p className="text-gray-600">Quick answers to frequently asked questions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">How quickly do you respond?</h3>
              <p className="text-sm text-gray-600">We typically respond to all inquiries within 24 hours during business days.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Is DocuFind really free?</h3>
              <p className="text-sm text-gray-600">Yes! Basic features are completely free. Premium features cost 500 RWF for enhanced visibility.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">How do I report a bug?</h3>
              <p className="text-sm text-gray-600">Select "Report a Bug" in the category above and describe the issue you encountered.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
