import { FileText, Mail, Phone, Github, Twitter, Linkedin } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function Footer() {
  const { t } = useLanguage();

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
                <h3 className="text-xl font-semibold">{t('docuFind')}</h3>
                <p className="text-sm text-gray-400">{t('lostFoundDocuments')}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {t('footerDescription')}
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
            <h4 className="font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition">{t('browseDocuments')}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">{t('reportLost')}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">{t('uploadFound')}</a></li>
              <li><a href="/how-it-works" className="text-gray-300 hover:text-white transition">{t('howItWorks')}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">{t('support')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/help" className="text-gray-300 hover:text-white transition">{t('helpCenter')}</a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-white transition">{t('privacyPolicy')}</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-white transition">{t('termsOfService')}</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition">{t('contactUs')}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            {t('copyright')}
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>{t('supportEmail')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>{t('supportPhone')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
