import { useState } from "react";
import { Pill, Shield, Clock, FileCheck, ChevronRight, Star } from "lucide-react";
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
    description: "No consultation fees, no hidden costs"
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Fast Turnaround",
    description: "Most prescriptions processed within 24 hours"
  },
  {
    icon: <FileCheck className="h-5 w-5" />,
    title: "Australian Doctors",
    description: "All prescriptions reviewed by qualified Australian Partner Doctors"
  }
];

const commonMedications = [
  "Blood pressure medications",
  "Diabetes medications", 
  "Cholesterol medications",
  "Asthma inhalers",
  "Contraceptive pills",
  "Antidepressants",
  "Thyroid medications"
];

const faqs = [
  {
    question: "What medications can I get renewed online?",
    answer: "We can renew most regular medications that you've been taking for ongoing conditions. This includes medications for blood pressure, diabetes, cholesterol, asthma, contraception, and mental health. We cannot prescribe controlled substances or new medications without an in-person consultation."
  },
  {
    question: "Do I need to provide my previous prescription?",
    answer: "While not always required, having details of your previous prescription helps speed up the process. You can provide the medication name, dosage, and prescribing doctor information in the request form."
  },
  {
    question: "How long does the process take?",
    answer: "Most prescription renewals are processed within 24 hours. Complex cases may take up to 48 hours. You'll receive an email notification when your prescription is ready."
  },
  {
    question: "Where can I fill my prescription?",
    answer: "Once approved, your prescription will be sent electronically to your nominated pharmacy or you can download it to take to any Australian pharmacy."
  }
];

export default function PrescriptionPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-freedoc-blue/10 to-indigo-600/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl">
                <Pill className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-freedoc-dark mb-6">
              Online Prescription{" "}
              <span className="bg-gradient-to-r from-freedoc-blue to-indigo-600 bg-clip-text text-transparent">
                Renewals
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Renew your regular medications online with qualified Australian Partner Doctors. 
              Completely free, secure, and convenient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-freedoc-blue to-blue-600 hover:shadow-xl text-white px-8 py-6 text-lg font-semibold"
                onClick={handleRequestClick}
              >
                Request Prescription Renewal
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-freedoc-blue text-freedoc-blue hover:bg-freedoc-blue/5 px-8 py-6 text-lg"
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
                <span>Australian Registered Doctors</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>24 Hour Processing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-freedoc-dark mb-4">Why Choose Online Prescriptions?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Save time and money with our streamlined prescription renewal service
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-white/50 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto p-3 rounded-xl bg-gradient-to-br from-freedoc-blue/10 to-blue-100 w-fit mb-4">
                    <div className="text-freedoc-blue">
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

      {/* Common Medications Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-freedoc-dark text-center mb-12">
              Commonly Renewed Medications
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {commonMedications.map((medication, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-lg bg-white border border-slate-200 hover:border-freedoc-blue/30 transition-colors">
                  <div className="p-2 rounded-lg bg-freedoc-blue/10">
                    <Pill className="h-4 w-4 text-freedoc-blue" />
                  </div>
                  <span className="text-slate-700 font-medium">{medication}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button
                className="bg-gradient-to-r from-freedoc-blue to-blue-600 text-white"
                onClick={handleRequestClick}
              >
                Check if Your Medication Qualifies
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
                  <AccordionTrigger className="text-left font-semibold text-freedoc-dark hover:text-freedoc-blue">
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
      <section className="py-20 bg-gradient-to-r from-freedoc-blue to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Renew Your Prescription?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Australians who trust freedoc for their medication renewals
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-freedoc-blue hover:bg-gray-50 px-8 py-6 text-lg font-semibold"
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
          serviceType="prescription"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={async (formData) => {
            console.log("Form submitted:", { serviceType: "prescription", formData });
            try {
              const response = await fetch("/api/consultations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  serviceType: "prescription",
                  formData: formData
                })
              });
              if (response.ok) {
                alert("Prescription request submitted successfully!");
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