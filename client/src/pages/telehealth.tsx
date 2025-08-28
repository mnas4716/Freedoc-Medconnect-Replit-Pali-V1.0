import { useState } from "react";
import { Video, Stethoscope, Shield, Clock, ChevronRight, Star, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ServiceFormModal } from "@/components/ui/service-form-modal";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/useAuth";

const features = [
  {
    icon: <Video className="h-5 w-5" />,
    title: "Video Consultations",
    description: "Face-to-face consultations from the comfort of your home"
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Flexible Scheduling",
    description: "Available 7 days a week with flexible appointment times"
  },
  {
    icon: <Stethoscope className="h-5 w-5" />,
    title: "Australian Doctors",
    description: "Qualified Australian Partner Doctors registered with AHPRA"
  }
];

const consultationTypes = [
  {
    title: "General Consultation",
    description: "Discuss general health concerns, symptoms, or get medical advice for common conditions",
    icon: <Stethoscope className="h-6 w-6" />,
    gradient: "from-orange-500 to-orange-600"
  },
  {
    title: "Follow-up Consultation",
    description: "Follow-up appointments for ongoing treatment or to discuss test results and recovery progress",
    icon: <Calendar className="h-6 w-6" />,
    gradient: "from-blue-500 to-blue-600"
  },
  {
    title: "Chronic Disease Management",
    description: "Ongoing care for chronic conditions like diabetes, hypertension, or heart disease",
    icon: <Users className="h-6 w-6" />,
    gradient: "from-green-500 to-green-600"
  },
  {
    title: "Preventive Care",
    description: "Health screenings, vaccinations, and preventive care to maintain your wellbeing",
    icon: <Shield className="h-6 w-6" />,
    gradient: "from-purple-500 to-purple-600"
  }
];

const faqs = [
  {
    question: "What can I discuss in a telehealth consultation?",
    answer: "You can discuss most non-emergency health concerns including general symptoms, follow-up care, chronic disease management, mental health, prescription renewals, and preventive care. Complex physical examinations may require in-person visits."
  },
  {
    question: "Do I need any special technology for telehealth?",
    answer: "You just need a device with a camera and microphone (smartphone, tablet, or computer) and a stable internet connection. We'll provide you with a secure link to join your appointment."
  },
  {
    question: "Are telehealth consultations as effective as in-person visits?",
    answer: "For many conditions, telehealth consultations are just as effective as in-person visits. Our doctors can assess symptoms, provide diagnoses, prescribe medications, and create treatment plans through secure video calls."
  },
  {
    question: "What happens if the doctor determines I need an in-person examination?",
    answer: "If our doctor determines you need a physical examination or diagnostic tests that can't be done remotely, they'll refer you to an appropriate local healthcare provider and provide detailed notes for continuity of care."
  }
];

export default function TelehealthPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-amber-500/10 to-red-600/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl">
                <Video className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-freedoc-dark mb-6">
              Telehealth{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Consultations
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with qualified Australian Partner Doctors through secure video consultations. 
              Get professional medical care from anywhere, completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-xl text-white px-8 py-6 text-lg font-semibold"
                onClick={handleRequestClick}
              >
                Book Telehealth Consultation
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg"
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
                <span>AHPRA Registered Doctors</span>
              </div>
              <div className="flex items-center space-x-2">
                <Video className="h-4 w-4 text-orange-500" />
                <span>Secure Video Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-freedoc-dark mb-4">Why Choose Telehealth?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Access quality healthcare without leaving your home, office, or wherever you are
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-white/50 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-100 w-fit mb-4">
                    <div className="text-orange-600">
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

      {/* Consultation Types Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-freedoc-dark text-center mb-12">
              Types of Consultations Available
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {consultationTypes.map((consultation, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-white/50 bg-white/80 backdrop-blur-sm hover:border-orange-200">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${consultation.gradient} text-white flex-shrink-0`}>
                        {consultation.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-freedoc-dark mb-2">{consultation.title}</CardTitle>
                        <CardDescription className="text-slate-600 leading-relaxed">{consultation.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                onClick={handleRequestClick}
              >
                Book Your Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-freedoc-dark text-center mb-12">
              How Telehealth Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-freedoc-dark mb-2">Book Online</h3>
                <p className="text-slate-600">Fill out our simple consultation request form with your health concerns and preferred appointment time.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-freedoc-dark mb-2">Get Matched</h3>
                <p className="text-slate-600">Our system assigns you to an available Australian Partner Doctor who specializes in your area of concern.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-freedoc-dark mb-2">Video Consult</h3>
                <p className="text-slate-600">Join your secure video consultation at the scheduled time and receive professional medical care.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-freedoc-dark text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-slate-200 rounded-lg px-6 bg-white/80 backdrop-blur-sm">
                  <AccordionTrigger className="text-left font-semibold text-freedoc-dark hover:text-orange-600">
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
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for Your Virtual Doctor Visit?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Experience the convenience of professional healthcare from anywhere in Australia
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-6 text-lg font-semibold"
            onClick={handleRequestClick}
          >
            Book Your Consultation Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Service Request Modal */}
      {showModal && (
        <ServiceFormModal
          serviceType="telehealth"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={async (formData) => {
            console.log("Form submitted:", { serviceType: "telehealth", formData });
            try {
              const response = await fetch("/api/consultations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  serviceType: "telehealth",
                  formData: formData
                })
              });
              if (response.ok) {
                alert("Telehealth consultation request submitted successfully!");
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