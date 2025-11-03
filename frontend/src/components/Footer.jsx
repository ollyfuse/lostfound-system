import { FileText, Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-500 p-2 rounded-lg">
                <FileText className="text-white w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">DocuFind</h3>
                <p className="text-sm text-gray-400">Lost & Found Documents</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              A secure platform helping people reunite with their important documents. 
              Your privacy is protected while making recovery possible.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/ollyfuse" className="text-gray-400 hover:text-white transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition">Browse Documents</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Report Lost</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Upload Found</a></li>
              <li><a href="/how-it-works" className="text-gray-300 hover:text-white transition">How It Works</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/help" className="text-gray-300 hover:text-white transition">Help Center</a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-white transition">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-white transition">Terms of Service</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2025 DocuFind. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>support@docufind.com</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>+250 780286626</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
