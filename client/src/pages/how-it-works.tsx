import { CheckCircle2, UserPlus, Mail, Calendar, FileText, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const steps = [
  {
    icon: <UserPlus className="h-12 w-12 text-freedoc-blue" />,
    title: "1. Sign Up",
    description: "Create your free account with basic information and verify your email address.",
  },
  {
    icon: <FileText className="h-12 w-12 text-freedoc-blue" />,
    title: "2. Request Service",
    description: "Fill out a secure online form with your medical history and service requirements.",
  },
  {
    icon: <Calendar className="h-12 w-12 text-freedoc-blue" />,
    title: "3. Get Matched",
    description: "Our system assigns you to an available Australian Partner Doctor for consultation.",
  },
];

const benefits = [
  "100% free consultations and services",
  "AHPRA registered Australian doctors",
  "Secure and private platform",
  "Available 7 days a week",
  "No waiting rooms or travel time",
  "Instant digital prescriptions and certificates",
];

export default function HowItWorks() {
  return (
    <div className="bg-white text-freedoc-dark min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-freedoc-dark mb-6">
            How{" "}
            <span className="bg-gradient-to-r from-freedoc-blue to-indigo-600 bg-clip-text text-transparent">
              FreeDoc
            </span>{" "}
            Works
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Getting healthcare online has never been easier. Follow these simple steps to access free medical services from qualified Australian doctors.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-freedoc-dark mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our streamlined process makes healthcare accessible and convenient for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center relative">
                {/* Connector Line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-freedoc-blue to-blue-300 transform translate-x-1/2 z-0">
                    <ArrowRight className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 h-4 w-4 text-freedoc-blue bg-white rounded-full p-0.5" />
                  </div>
                )}
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg mb-6 border-2 border-blue-100">
                    {step.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-freedoc-dark mb-4">{step.title}</h3>
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-freedoc-dark mb-6">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-freedoc-blue to-indigo-600 bg-clip-text text-transparent">
                  FreeDoc?
                </span>
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                We're committed to making quality healthcare accessible to all Australians, completely free of charge.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
              <h3 className="text-2xl font-bold text-freedoc-dark mb-4">Ready to Get Started?</h3>
              <p className="text-slate-600 mb-6">
                Join thousands of Australians who trust FreeDoc for their healthcare needs.
              </p>
              <div className="space-y-4">
                <Link href="/register">
                  <Button className="w-full bg-gradient-to-r from-freedoc-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300">
                    Sign Up for Free
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full border-freedoc-blue text-freedoc-blue hover:bg-freedoc-blue hover:text-white transition-all duration-300">
                    View Dashboard Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-freedoc-dark mb-4">
            Our Services
          </h2>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
            Access a comprehensive range of medical services from the comfort of your home.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              "Online Prescriptions",
              "Medical Certificates", 
              "Mental Health Support",
              "Telehealth Consultations",
              "Pathology Referrals"
            ].map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-freedoc-dark text-sm sm:text-base">{service}</h4>
              </div>
            ))}
          </div>
          
          <div className="mt-12">
            <Link href="/">
              <Button variant="outline" className="border-freedoc-blue text-freedoc-blue hover:bg-freedoc-blue hover:text-white transition-all duration-300">
                Explore All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}