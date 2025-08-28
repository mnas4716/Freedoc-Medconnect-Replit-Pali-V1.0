import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Privacy() {
  const privacyPrinciples = [
    {
      icon: <Lock className="h-8 w-8 text-freedoc-blue" />,
      title: "Data Security",
      description: "Your health information is protected with enterprise-grade encryption and security measures."
    },
    {
      icon: <Eye className="h-8 w-8 text-freedoc-blue" />,
      title: "Transparency",
      description: "We clearly explain how your information is collected, used, and protected."
    },
    {
      icon: <UserCheck className="h-8 w-8 text-freedoc-blue" />,
      title: "Your Control",
      description: "You maintain control over your personal health information and can access it anytime."
    },
    {
      icon: <Database className="h-8 w-8 text-freedoc-blue" />,
      title: "Minimal Collection",
      description: "We only collect information necessary to provide you with quality healthcare services."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-freedoc-blue to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 mb-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Your privacy and the security of your health information is our top priority
          </p>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-freedoc-dark mb-4">Our Privacy Principles</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These principles guide how we handle your personal and health information
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {privacyPrinciples.map((principle, index) => (
              <Card key={index} className="border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {principle.icon}
                    <CardTitle className="text-xl text-freedoc-dark">{principle.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-base">
                    {principle.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose max-w-none">
              
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="h-6 w-6 text-freedoc-blue" />
                  <h2 className="text-2xl font-bold text-freedoc-dark m-0">1. Information We Collect</h2>
                </div>
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-freedoc-dark mb-3">Personal Information</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                      <li>Name, email address, phone number</li>
                      <li>Date of birth and Medicare number (when required)</li>
                      <li>Address and emergency contact information</li>
                    </ul>
                    
                    <h3 className="font-semibold text-freedoc-dark mb-3">Health Information</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                      <li>Medical history and current health conditions</li>
                      <li>Symptoms, medications, and treatment information</li>
                      <li>Consultation notes and doctor recommendations</li>
                    </ul>

                    <h3 className="font-semibold text-freedoc-dark mb-3">Technical Information</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                      <li>Device information and IP address</li>
                      <li>Usage data and platform interactions</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <UserCheck className="h-6 w-6 text-freedoc-blue" />
                  <h2 className="text-2xl font-bold text-freedoc-dark m-0">2. How We Use Your Information</h2>
                </div>
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-freedoc-dark mb-2">Healthcare Services</h3>
                        <p className="text-slate-600">To provide consultations, prescriptions, medical certificates, and other healthcare services.</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-freedoc-dark mb-2">Communication</h3>
                        <p className="text-slate-600">To communicate with you about appointments, follow-ups, and important health information.</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-freedoc-dark mb-2">Service Improvement</h3>
                        <p className="text-slate-600">To analyze usage patterns and improve our platform and services (using anonymized data).</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-freedoc-dark mb-2">Legal Compliance</h3>
                        <p className="text-slate-600">To comply with healthcare regulations, AHPRA requirements, and other legal obligations.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Lock className="h-6 w-6 text-freedoc-blue" />
                  <h2 className="text-2xl font-bold text-freedoc-dark m-0">3. How We Protect Your Information</h2>
                </div>
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-freedoc-dark mb-2">Encryption</h3>
                        <p className="text-slate-600">All data is encrypted in transit and at rest using industry-standard AES-256 encryption.</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-freedoc-dark mb-2">Access Controls</h3>
                        <p className="text-slate-600">Strict access controls ensure only authorized healthcare professionals can access your information.</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-freedoc-dark mb-2">Secure Infrastructure</h3>
                        <p className="text-slate-600">Our systems are hosted on secure, compliant cloud infrastructure with regular security audits.</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-freedoc-dark mb-2">Staff Training</h3>
                        <p className="text-slate-600">All staff undergo privacy and security training and sign confidentiality agreements.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="h-6 w-6 text-freedoc-blue" />
                  <h2 className="text-2xl font-bold text-freedoc-dark m-0">4. Information Sharing</h2>
                </div>
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <p className="text-slate-600 mb-4">
                      We do not sell, rent, or trade your personal information. We only share information in these limited circumstances:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                      <li><strong>Healthcare Providers:</strong> With doctors and healthcare professionals involved in your care</li>
                      <li><strong>Emergency Situations:</strong> When necessary to protect your health and safety</li>
                      <li><strong>Legal Requirements:</strong> When required by law, court order, or regulatory authority</li>
                      <li><strong>Service Providers:</strong> With trusted partners who help deliver our services (under strict confidentiality agreements)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Database className="h-6 w-6 text-freedoc-blue" />
                  <h2 className="text-2xl font-bold text-freedoc-dark m-0">5. Your Rights</h2>
                </div>
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <p className="text-slate-600 mb-4">Under Australian privacy law, you have the right to:</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                      <li>Access your personal and health information</li>
                      <li>Request correction of inaccurate information</li>
                      <li>Request deletion of your information (subject to legal and clinical requirements)</li>
                      <li>Restrict processing of your information</li>
                      <li>Receive a copy of your information in a portable format</li>
                      <li>Withdraw consent (where applicable)</li>
                      <li>Make a complaint about our privacy practices</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-6 w-6 text-freedoc-blue" />
                  <h2 className="text-2xl font-bold text-freedoc-dark m-0">6. Retention and Deletion</h2>
                </div>
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <p className="text-slate-600 mb-4">
                      We retain your information in accordance with Australian healthcare record-keeping requirements:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                      <li>Clinical records: Minimum 7 years after last treatment</li>
                      <li>Personal information: As long as necessary to provide services</li>
                      <li>Technical data: Typically deleted after 2 years</li>
                      <li>Marketing data: Until you opt-out or as required by law</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-freedoc-dark mb-4">7. Contact Us</h2>
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <p className="text-slate-600 mb-4">
                      If you have questions about this Privacy Policy or want to exercise your rights, contact us:
                    </p>
                    <div className="space-y-2 text-slate-600">
                      <p><strong>Privacy Officer:</strong> privacy@freedoc.com.au</p>
                      <p><strong>Phone:</strong> 1800 FREEDOC (1800 373 336)</p>
                      <p><strong>Address:</strong> FreeDoc Australia, Privacy Department, PO Box 1234, Sydney NSW 2001</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-sm text-slate-600">
                  <strong>Last Updated:</strong> January 11, 2025<br />
                  <strong>Effective Date:</strong> January 11, 2025<br />
                  This privacy policy may be updated from time to time. We will notify you of any significant changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}