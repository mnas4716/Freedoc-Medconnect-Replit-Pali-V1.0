import { useState } from "react";
import { Brain, Heart, Shield, Clock, ChevronRight, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ServiceFormModal } from "@/components/ui/service-form-modal";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/useAuth";

const features = [
  {
    icon: <Heart className="h-5 w-5" />,
    title: "Compassionate Care",
    description: "Empathetic support from qualified mental health professionals"
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Confidential & Safe",
    description: "Private consultations with strict confidentiality"
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Immediate Access",
    description: "No waiting lists, get support when you need it most"
  }
];

const supportTypes = [
  {
    title: "Mental Health Care Plans",
    description: "Comprehensive care plans for ongoing mental health support, including Medicare rebates for psychology sessions",
    icon: <Brain className="h-6 w-6" />,
    gradient: "from-purple-500 to-purple-600"
  },
  {
    title: "Counseling Referrals",
    description: "Professional referrals to qualified psychologists and counselors in your area",
    icon: <Users className="h-6 w-6" />,
    gradient: "from-indigo-500 to-indigo-600"
  },
  {
    title: "Medication Reviews",
    description: "Review and adjustment of mental health medications by qualified psychiatrists",
    icon: <Heart className="h-6 w-6" />,
    gradient: "from-pink-500 to-pink-600"
  },
  {
    title: "Crisis Support",
    description: "Immediate assessment and support for mental health crises and urgent situations",
    icon: <Shield className="h-6 w-6" />,
    gradient: "from-red-500 to-red-600"
  }
];

const faqs = [
  {
    question: "What mental health services do you offer?",
    answer: "We provide Mental Health Care Plans, counseling referrals, medication reviews, and crisis support. Our qualified Australian doctors can assess your mental health needs and create appropriate treatment plans."
  },
  {
    question: "Are mental health consultations confidential?",
    answer: "Absolutely. All mental health consultations are strictly confidential and follow Australian privacy laws. Your information is only shared with your consent or when legally required for your safety."
  },
  {
    question: "Can I get Medicare rebates for mental health services?",
    answer: "Yes, with a Mental Health Care Plan from our doctors, you may be eligible for Medicare rebates for psychology sessions. We'll help you understand what rebates you're entitled to."
  },
  {
    question: "What if I'm in crisis or having suicidal thoughts?",
    answer: "If you're in immediate danger, please call 000 or go to your nearest emergency department. For crisis support, you can contact Lifeline (13 11 14) or Beyond Blue (1300 22 4636) immediately."
  }
];

export default function MentalHealthPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-indigo-500/10 to-pink-600/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-xl">
                <Brain className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-freedoc-dark mb-6">
              Mental Health{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Support
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Access compassionate mental health care from qualified Australian professionals. 
              Get support for anxiety, depression, stress, and other mental health concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-xl text-white px-8 py-6 text-lg font-semibold"
                onClick={handleRequestClick}
              >
                Get Mental Health Support
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg"
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
                <span>Completely Confidential</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Compassionate Care</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-freedoc-dark mb-4">Why Choose Online Mental Health Care?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Access professional mental health support from the comfort and privacy of your own home
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-white/50 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-100 w-fit mb-4">
                    <div className="text-purple-600">
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

      {/* Support Types Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-freedoc-dark text-center mb-12">
              Mental Health Services Available
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {supportTypes.map((support, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-white/50 bg-white/80 backdrop-blur-sm hover:border-purple-200">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${support.gradient} text-white flex-shrink-0`}>
                        {support.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-freedoc-dark mb-2">{support.title}</CardTitle>
                        <CardDescription className="text-slate-600 leading-relaxed">{support.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                onClick={handleRequestClick}
              >
                Request Mental Health Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Notice */}
      <section className="py-12 bg-red-50 border-l-4 border-red-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <Shield className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Crisis Support Available 24/7</h3>
                <p className="text-red-700 mb-4">
                  If you're experiencing a mental health crisis or having thoughts of self-harm, immediate help is available:
                </p>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <h4 className="font-semibold text-red-800">Emergency</h4>
                    <p className="text-red-700">Call <strong>000</strong> or visit your nearest emergency department</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <h4 className="font-semibold text-red-800">Crisis Support</h4>
                    <p className="text-red-700">Lifeline: <strong>13 11 14</strong><br />Beyond Blue: <strong>1300 22 4636</strong></p>
                  </div>
                </div>
              </div>
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
                  <AccordionTrigger className="text-left font-semibold text-freedoc-dark hover:text-purple-600">
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
      <section className="py-20 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Take Care of Your Mental Health?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Your mental health matters. Get the support you deserve from qualified professionals.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-6 text-lg font-semibold"
            onClick={handleRequestClick}
          >
            Start Your Mental Health Journey
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Service Request Modal */}
      {showModal && (
        <ServiceFormModal
          serviceType="mental_health"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={async (formData) => {
            console.log("Form submitted:", { serviceType: "mental_health", formData });
            try {
              const response = await fetch("/api/consultations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  serviceType: "mental_health",
                  formData: formData
                })
              });
              if (response.ok) {
                alert("Mental health request submitted successfully!");
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