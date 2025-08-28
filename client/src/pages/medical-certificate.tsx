import { useState } from "react";
import { FileText, Shield, Clock, Download, ChevronRight, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ServiceFormModal } from "@/components/ui/service-form-modal";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/useAuth";

const features = [
  {
    icon: <Shield className="h-5 w-5" />,
    title: "100% Free",
    description: "No consultation fees for medical certificates"
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Same Day Issue",
    description: "Get your certificate within hours, not days"
  },
  {
    icon: <Download className="h-5 w-5" />,
    title: "Digital & Print",
    description: "Download instantly or have it sent to your employer"
  }
];

const certificateTypes = [
  {
    title: "Sick Leave Certificate",
    description: "For time off work due to illness or medical appointments",
    icon: <FileText className="h-6 w-6" />
  },
  {
    title: "Fitness to Work",
    description: "Confirm your ability to return to work after illness or injury",
    icon: <CheckCircle className="h-6 w-6" />
  },
  {
    title: "Study Exemption",
    description: "Medical certificates for university or TAFE absences",
    icon: <FileText className="h-6 w-6" />
  },
  {
    title: "General Medical",
    description: "For insurance claims, travel, or other medical documentation needs",
    icon: <Shield className="h-6 w-6" />
  }
];

const faqs = [
  {
    question: "What types of medical certificates can you provide?",
    answer: "We provide sick leave certificates, fitness to work certificates, study exemption certificates, and general medical certificates for various purposes including insurance and travel."
  },
  {
    question: "Are online medical certificates legally valid?",
    answer: "Yes, medical certificates issued by registered Australian doctors through telehealth consultations are legally valid and accepted by employers, educational institutions, and government agencies."
  },
  {
    question: "How quickly can I get my certificate?",
    answer: "Most certificates are issued within 2-4 hours during business hours. Complex cases may take up to 24 hours. You'll receive an email notification when ready."
  },
  {
    question: "What information do I need to provide?",
    answer: "You'll need to describe your symptoms or condition, specify the certificate type needed, and provide the dates you require coverage for. Our doctors may ask follow-up questions if needed."
  }
];

export default function MedicalCertificatePage() {
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleRequestClick = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-green-500/10 to-teal-600/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-xl">
                <FileText className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-freedoc-dark mb-6">
              Medical{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Certificates
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get legally valid medical certificates from qualified Australian Partner Doctors. 
              Completely free, fast, and accepted everywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-xl text-white px-8 py-6 text-lg font-semibold"
                onClick={handleRequestClick}
              >
                Request Medical Certificate
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>100% Free Service</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Legally Valid</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-emerald-500" />
                <span>Same Day Issue</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-freedoc-dark mb-4">Why Choose Online Medical Certificates?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Skip the clinic wait times and get your certificate from the comfort of home
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-white/50 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-100 w-fit mb-4">
                    <div className="text-emerald-600">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-freedoc-dark">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-600">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Types Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-freedoc-dark text-center mb-12">
              Types of Medical Certificates
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {certificateTypes.map((cert, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-white/50 bg-white/80 backdrop-blur-sm hover:border-emerald-200">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                        {cert.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-freedoc-dark">{cert.title}</CardTitle>
                        <CardDescription className="text-slate-600 mt-2">{cert.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                onClick={handleRequestClick}
              >
                Request Your Certificate
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-freedoc-dark text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-slate-200 rounded-lg px-6 bg-white/80 backdrop-blur-sm">
                  <AccordionTrigger className="text-left font-semibold text-freedoc-dark hover:text-emerald-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need a Medical Certificate Today?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Get your legally valid medical certificate in hours, not days
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-6 text-lg font-semibold"
            onClick={handleRequestClick}
          >
            Start Your Request Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Service Request Modal */}
      {showModal && (
        <ServiceFormModal
          serviceType="medical_certificate"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={async (formData) => {
            console.log("Form submitted:", { serviceType: "medical_certificate", formData });
            try {
              const response = await fetch("/api/consultations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  serviceType: "medical_certificate",
                  formData: formData
                })
              });
              if (response.ok) {
                alert("Medical certificate request submitted successfully!");
                setShowModal(false);
              } else {
                alert("Failed to submit request. Please try again.");
              }
            } catch (error) {
              console.error("Error submitting request:", error);
              alert("Failed to submit request. Please try again.");
            }
          }}
        />
      )}
      
      <Footer />
    </div>
  );
}