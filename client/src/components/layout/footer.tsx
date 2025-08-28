import { Link } from "wouter";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-freedoc-blue to-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FreeDoc</span>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Australia's premier free telehealth platform connecting patients with qualified Partner Doctors for comprehensive healthcare services.
            </p>
            <div className="flex items-center space-x-2 text-slate-300 text-sm">
              <MapPin className="h-4 w-4" />
              <span>Australia Wide</span>
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="font-semibold text-white mb-4">Healthcare Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/prescriptions" className="text-slate-300 hover:text-white text-sm transition-colors">
                  Online Prescriptions
                </Link>
              </li>
              <li>
                <Link to="/medical-certificates" className="text-slate-300 hover:text-white text-sm transition-colors">
                  Medical Certificates
                </Link>
              </li>
              <li>
                <Link to="/mental-health" className="text-slate-300 hover:text-white text-sm transition-colors">
                  Mental Health
                </Link>
              </li>
              <li>
                <Link to="/telehealth" className="text-slate-300 hover:text-white text-sm transition-colors">
                  Telehealth Consultations
                </Link>
              </li>
              <li>
                <Link to="/pathology" className="text-slate-300 hover:text-white text-sm transition-colors">
                  Pathology Referrals
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Section */}
          <div>
            <h3 className="font-semibold text-white mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-slate-300 hover:text-white text-sm transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-300 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-300 hover:text-white text-sm transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-white mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-slate-300" />
                <a href="mailto:support@freedoc.com.au" className="text-slate-300 hover:text-white text-sm transition-colors">
                  support@freedoc.com.au
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-slate-300" />
                <a href="tel:1800FREEDOC" className="text-slate-300 hover:text-white text-sm transition-colors">
                  1800 FREEDOC
                </a>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-400 text-xs">
                Available 24/7 for urgent medical consultations
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2025 FreeDoc Australia. All rights reserved. ABN: 123 456 789
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-slate-400 hover:text-white text-xs transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-slate-400 hover:text-white text-xs transition-colors">
                Terms
              </Link>
              <span className="text-slate-400 text-xs">
                Regulated by AHPRA
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}