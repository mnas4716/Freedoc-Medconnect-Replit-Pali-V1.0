import { ArrowRight, Pill, Stethoscope, Brain, TestTube2, BookOpen, BadgeCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const services = [
  {
    name: "Online Prescriptions",
    href: "/dashboard",
    icon: <Pill className="h-8 w-8 text-freedoc-blue" />,
    description: "Renew your scripts online quickly and easily.",
    gradient: "from-blue-50 to-indigo-50",
  },
  {
    name: "Medical Certificates",
    href: "/dashboard",
    icon: <Stethoscope className="h-8 w-8 text-freedoc-blue" />,
    description: "Get medical certificates for work or study.",
    gradient: "from-emerald-50 to-teal-50",
  },
  {
    name: "Mental Health Support",
    href: "/dashboard",
    icon: <Brain className="h-8 w-8 text-freedoc-blue" />,
    description: "Access mental health care plans and support.",
    gradient: "from-purple-50 to-violet-50",
  },
  {
    name: "Telehealth Consults",
    href: "/dashboard",
    icon: <Stethoscope className="h-8 w-8 text-freedoc-blue" />,
    description: "Speak to an Australian Partner Doctor online.",
    gradient: "from-orange-50 to-amber-50",
  },
  {
    name: "Pathology Referrals",
    href: "/dashboard",
    icon: <TestTube2 className="h-8 w-8 text-freedoc-blue" />,
    description: "Online referrals for a range of pathology tests.",
    gradient: "from-rose-50 to-pink-50",
  },
  {
    name: "How It Works",
    href: "/how-it-works",
    icon: <BookOpen className="h-8 w-8 text-freedoc-blue" />,
    description: "Learn how our online services operate.",
    gradient: "from-cyan-50 to-sky-50",
  },
];

export default function Landing() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 text-freedoc-dark min-h-screen">
      <Navbar />
      
      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 w-full text-center shadow-lg">
        <div className="container mx-auto flex items-center justify-center gap-3">
          <Sparkles className="h-5 w-5 text-blue-100 animate-pulse" />
          <div>
            <p className="font-semibold text-white">Currently under development</p>
            <p className="text-sm text-blue-100">
              Our new and improved telehealth platform will be launching soon
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm text-freedoc-blue font-medium px-4 py-2 rounded-full text-sm mb-8 border border-blue-200/50">
            <Sparkles className="w-4 h-4" />
            <span>Australia's First Truly Free Online Doctor</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-freedoc-dark mb-6 leading-tight max-w-4xl mx-auto">
            Healthcare Made{" "}
            <span className="bg-gradient-to-r from-freedoc-blue via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Simple
            </span>{" "}
            & Free
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect with Australian Partner Doctors for prescriptions, medical certificates, and more — all from the
            comfort of your home, completely free of charge.
          </p>
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 font-semibold px-8 py-4 rounded-2xl text-base sm:text-lg shadow-lg border border-green-200/50">
            <BadgeCheck className="w-6 h-6 mr-3 flex-shrink-0" />
            <span>100% Free Consultations & Services</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 lg:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-freedoc-dark mb-4">
              How We Can{" "}
              <span className="bg-gradient-to-r from-freedoc-blue to-indigo-600 bg-clip-text text-transparent">
                Help You
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of free online healthcare services
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                href={service.href}
                key={service.name}
                className={`group block p-8 bg-gradient-to-br ${service.gradient} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50 backdrop-blur-sm relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg group-hover:shadow-xl transition-all duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-freedoc-dark ml-4">{service.name}</h3>
                  </div>
                  <p className="text-slate-600 mb-6 text-sm sm:text-base leading-relaxed">{service.description}</p>
                  <div className="text-freedoc-blue font-semibold flex items-center text-sm sm:text-base group-hover:gap-3 transition-all duration-300">
                    Learn More{" "}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-freedoc-blue/5 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h5 className="font-semibold text-white mb-4 text-lg">Services</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/dashboard" className="hover:text-freedoc-blue transition-colors duration-200 hover:translate-x-1 inline-block">
                    Online Prescriptions
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-freedoc-blue transition-colors duration-200 hover:translate-x-1 inline-block">
                    Medical Certificates
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-freedoc-blue transition-colors duration-200 hover:translate-x-1 inline-block">
                    Mental Health
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-freedoc-blue transition-colors duration-200 hover:translate-x-1 inline-block">
                    Telehealth
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-freedoc-blue transition-colors duration-200 hover:translate-x-1 inline-block">
                    Pathology
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-4 text-lg">About</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/how-it-works" className="hover:text-freedoc-blue transition-colors duration-200 hover:translate-x-1 inline-block">
                    How it Works
                  </Link>
                </li>
                <li>
                  <a href="#about" className="hover:text-freedoc-blue transition-colors duration-200 hover:translate-x-1 inline-block">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-freedoc-blue transition-colors duration-200 hover:translate-x-1 inline-block">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-4 text-lg">Legal</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#privacy" className="hover:text-freedoc-blue transition-colors duration-200 hover:translate-x-1 inline-block">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-freedoc-blue transition-colors duration-200 hover:translate-x-1 inline-block">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-4 text-lg">Connect</h5>
              <p className="text-sm text-slate-400 leading-relaxed">Follow us for updates on our launch!</p>
            </div>
          </div>
          <div className="text-center text-slate-400 text-sm border-t border-slate-700 pt-8">
            <div className="bg-gradient-to-r from-freedoc-blue to-indigo-600 bg-clip-text text-transparent font-semibold text-lg mb-2">
              © {new Date().getFullYear()} FreeDoc. All rights reserved.
            </div>
            <p className="text-xs mt-2 max-w-3xl mx-auto leading-relaxed">
              This website is for informational purposes and does not constitute medical advice. Always consult with a
              qualified healthcare provider for any health concerns or before making any decisions related to your health
              or treatment.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}