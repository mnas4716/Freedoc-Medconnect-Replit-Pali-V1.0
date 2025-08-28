import { useState } from "react";
import { TestTube2, FileText, Shield, Clock, ChevronRight, Star, Activity, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ServiceFormModal } from "@/components/ui/service-form-modal";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/useAuth";

const features = [
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Easy Referrals",
    description: "Get pathology referrals without visiting a clinic"
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Fast Processing",
    description: "Referrals issued within hours, not days"
  },
  {
    icon: <TestTube2 className="h-5 w-5" />,
    title: "Major Labs Accepted",
    description: "Use at Australian Clinical Labs, Healius, and QML"
  }
];

const testTypes = [
  {
    title: "Blood Work & Full Blood Count",
    description: "Comprehensive blood tests including FBC, iron studies, liver function, and kidney function tests",
    icon: <TestTube2 className="h-6 w-6" />,
    gradient: "from-red-500 to-red-600",
    tests: ["Full Blood Count (FBC)", "Iron Studies", "Liver Function Tests", "Kidney Function Tests", "Electrolyte Panel"]
  },
  {
    title: "Diabetes Screening",
    description: "Blood glucose testing, HbA1c, and comprehensive diabetes monitoring panels",
    icon: <Activity className="h-6 w-6" />,
    gradient: "from-blue-500 to-blue-600",
    tests: ["Fasting Glucose", "HbA1c", "Glucose Tolerance Test", "Random Glucose", "C-Peptide"]
  },
  {
    title: "Cholesterol & Lipid Profile",
    description: "Complete cholesterol testing including HDL, LDL, triglycerides, and cardiovascular risk assessment",
    icon: <Heart className="h-6 w-6" />,
    gradient: "from-green-500 to-green-600",
    tests: ["Total Cholesterol", "HDL Cholesterol", "LDL Cholesterol", "Triglycerides", "Cholesterol Ratio"]
  },
  {
    title: "Thyroid Function Tests",
    description: "Comprehensive thyroid screening including TSH, T3, T4, and thyroid antibody testing",
    icon: <TestTube2 className="h-6 w-6" />,
    gradient: "from-purple-500 to-purple-600",
    tests: ["TSH", "Free T4", "Free T3", "Thyroid Antibodies", "Reverse T3"]
  },
  {
    title: "Vitamin & Mineral Testing",
    description: "Essential vitamin and mineral level testing including B12, folate, vitamin D, and more",
    icon: <Activity className="h-6 w-6" />,
    gradient: "from-yellow-500 to-yellow-600",
    tests: ["Vitamin D", "Vitamin B12", "Folate", "Iron/Ferritin", "Magnesium"]
  },
  {
    title: "Specialized Testing",
    description: "Custom pathology referrals for specific conditions or as requested by your healthcare provider",
    icon: <FileText className="h-6 w-6" />,
    gradient: "from-indigo-500 to-indigo-600",
    tests: ["Inflammatory Markers", "Tumor Markers", "Hormone Panels", "Allergy Testing", "Genetic Testing"]
  }
];

const faqs = [
  {
    question: "What pathology tests can I get referrals for?",
    answer: "We can provide referrals for most standard pathology tests including blood work, diabetes screening, cholesterol testing, thyroid function, vitamin levels, and many specialized tests. Our doctors will assess your symptoms and medical history to determine appropriate testing."
  },
  {
    question: "Do I need to fast before my blood test?",
    answer: "Some tests require fasting (usually 8-12 hours), while others don't. When you receive your pathology referral, it will clearly indicate if fasting is required and provide detailed preparation instructions."
  },
  {
    question: "Where can I get my blood test done?",
    answer: "Our referrals are accepted at major pathology labs across Australia including Australian Clinical Labs, Healius Pathology, and QML Pathology. You can choose your preferred location when booking."
  },
  {
    question: "How do I get my test results?",
    answer: "Test results are typically available within 24-48 hours and will be sent directly to our doctors. You'll receive a secure message with your results and any necessary follow-up recommendations."
  }
];

export default function PathologyPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 via-pink-500/10 to-red-600/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-xl">
                <TestTube2 className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-freedoc-dark mb-6">
              Pathology{" "}
              <span className="bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                Referrals
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get pathology referrals for blood tests and health screenings from qualified Australian Partner Doctors. 
              Completely free, fast, and accepted at major labs nationwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-rose-500 to-rose-600 hover:shadow-xl text-white px-8 py-6 text-lg font-semibold"
                onClick={handleRequestClick}
              >
                Request Pathology Referral
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-rose-600 text-rose-600 hover:bg-rose-50 px-8 py-6 text-lg"
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
                <span>Major Labs Accepted</span>
              </div>
              <div className="flex items-center space-x-2">
                <TestTube2 className="h-4 w-4 text-rose-500" />
                <span>Fast Processing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-freedoc-dark mb-4">Why Choose Online Pathology Referrals?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Skip the GP visit and get your blood test referrals quickly and conveniently
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-white/50 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto p-3 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-100 w-fit mb-4">
                    <div className="text-rose-600">
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

      {/* Test Types Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-freedoc-dark text-center mb-12">
              Types of Pathology Tests Available
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {testTypes.map((testType, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-white/50 bg-white/80 backdrop-blur-sm hover:border-rose-200">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${testType.gradient} text-white flex-shrink-0`}>
                        {testType.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-freedoc-dark mb-2">{testType.title}</CardTitle>
                        <CardDescription className="text-slate-600 leading-relaxed mb-4">{testType.description}</CardDescription>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-700 mb-2">Common tests include:</p>
                          <div className="flex flex-wrap gap-2">
                            {testType.tests.map((test, testIndex) => (
                              <span
                                key={testIndex}
                                className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                              >
                                {test}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button
                className="bg-gradient-to-r from-rose-500 to-rose-600 text-white"
                onClick={handleRequestClick}
              >
                Request Your Referral
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
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-bold text-freedoc-dark mb-2">Request Online</h3>
                <p className="text-sm text-slate-600">Tell us what tests you need and describe your symptoms or reasons.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-bold text-freedoc-dark mb-2">Doctor Review</h3>
                <p className="text-sm text-slate-600">Our Australian Partner Doctor reviews your case and approves appropriate tests.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-bold text-freedoc-dark mb-2">Get Referral</h3>
                <p className="text-sm text-slate-600">Receive your pathology referral via email with lab location options.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-bold text-freedoc-dark mb-2">Visit Lab</h3>
                <p className="text-sm text-slate-600">Take your referral to any major pathology lab and get your tests done.</p>
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
                  <AccordionTrigger className="text-left font-semibold text-freedoc-dark hover:text-rose-600">
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
      <section className="py-20 bg-gradient-to-r from-rose-500 to-rose-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for Your Health Check?</h2>
          <p className="text-xl text-rose-100 mb-8 max-w-2xl mx-auto">
            Get the pathology referrals you need without the hassle of clinic visits
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-rose-600 hover:bg-gray-50 px-8 py-6 text-lg font-semibold"
            onClick={handleRequestClick}
          >
            Request Referral Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Service Request Modal */}
      {showModal && (
        <ServiceFormModal
          serviceType="pathology"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={async (formData) => {
            console.log("Form submitted:", { serviceType: "pathology", formData });
            try {
              const response = await fetch("/api/consultations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  serviceType: "pathology",
                  formData: formData
                })
              });
              if (response.ok) {
                alert("Pathology referral request submitted successfully!");
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