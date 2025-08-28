import { Scale, FileText, AlertTriangle, Users, Shield, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-freedoc-blue to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Scale className="h-16 w-16 mb-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms & Conditions</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Please read these terms carefully before using our healthcare services
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Alert className="max-w-4xl mx-auto border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Medical Disclaimer:</strong> FreeDoc provides general health information and facilitates consultations with licensed doctors. 
              For medical emergencies, call 000 immediately. Our services supplement but do not replace your relationship with your regular healthcare provider.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6 text-freedoc-blue" />
                <h2 className="text-2xl font-bold text-freedoc-dark m-0">1. Acceptance of Terms</h2>
              </div>
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <p className="text-slate-600 mb-4">
                    By accessing or using FreeDoc's services, you agree to be bound by these Terms and Conditions. 
                    If you do not agree to these terms, please do not use our services.
                  </p>
                  <ul className="list-disc list-inside text-slate-600 space-y-2">
                    <li>These terms apply to all users of the FreeDoc platform</li>
                    <li>By creating an account, you confirm you are 18+ years old or have parental consent</li>
                    <li>You agree to provide accurate and complete information</li>
                    <li>You are responsible for maintaining the confidentiality of your account</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-6 w-6 text-freedoc-blue" />
                <h2 className="text-2xl font-bold text-freedoc-dark m-0">2. Description of Services</h2>
              </div>
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <p className="text-slate-600 mb-4">
                    FreeDoc provides the following healthcare services through our digital platform:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-freedoc-dark">Core Services</h3>
                      <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                        <li>Online medical consultations</li>
                        <li>Prescription services</li>
                        <li>Medical certificate issuance</li>
                        <li>Mental health support</li>
                        <li>Pathology referrals</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-freedoc-dark">Service Limitations</h3>
                      <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                        <li>Not for emergency situations</li>
                        <li>Limited to scope of telehealth</li>
                        <li>Requires internet access</li>
                        <li>Subject to doctor availability</li>
                        <li>Certain medications excluded</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-freedoc-blue" />
                <h2 className="text-2xl font-bold text-freedoc-dark m-0">3. Medical Responsibilities</h2>
              </div>
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-freedoc-dark mb-2">Patient Responsibilities</h3>
                      <ul className="list-disc list-inside text-slate-600 space-y-1">
                        <li>Provide accurate medical history and current symptoms</li>
                        <li>Follow prescribed treatment plans and medication instructions</li>
                        <li>Seek emergency care when appropriate (call 000)</li>
                        <li>Inform doctors of all medications and allergies</li>
                        <li>Keep scheduled follow-up appointments</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-freedoc-dark mb-2">Doctor Responsibilities</h3>
                      <ul className="list-disc list-inside text-slate-600 space-y-1">
                        <li>Maintain professional standards and AHPRA registration</li>
                        <li>Provide care within scope of telehealth practice</li>
                        <li>Refer patients for in-person care when necessary</li>
                        <li>Maintain patient confidentiality</li>
                        <li>Document consultations appropriately</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-6 w-6 text-freedoc-blue" />
                <h2 className="text-2xl font-bold text-freedoc-dark m-0">4. Free Service Terms</h2>
              </div>
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <p className="text-slate-600">
                      <strong>No Cost Services:</strong> All FreeDoc services are provided at no cost to patients. 
                      There are no consultation fees, subscription charges, or hidden costs.
                    </p>
                    <p className="text-slate-600">
                      <strong>Medication Costs:</strong> While consultations are free, patients are responsible for 
                      the cost of prescribed medications from pharmacies.
                    </p>
                    <p className="text-slate-600">
                      <strong>Service Continuation:</strong> We aim to maintain free services but reserve the right 
                      to modify our service model with appropriate notice to users.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-6 w-6 text-freedoc-blue" />
                <h2 className="text-2xl font-bold text-freedoc-dark m-0">5. Limitations and Disclaimers</h2>
              </div>
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-freedoc-dark mb-2">Service Limitations</h3>
                      <ul className="list-disc list-inside text-slate-600 space-y-1">
                        <li>Services not available for medical emergencies</li>
                        <li>Limited to conditions suitable for telehealth</li>
                        <li>Cannot replace comprehensive physical examinations</li>
                        <li>Certain controlled substances cannot be prescribed</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-freedoc-dark mb-2">Technology Limitations</h3>
                      <ul className="list-disc list-inside text-slate-600 space-y-1">
                        <li>Platform availability depends on internet connectivity</li>
                        <li>Technical issues may occasionally interrupt services</li>
                        <li>Video quality may affect consultation quality</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Scale className="h-6 w-6 text-freedoc-blue" />
                <h2 className="text-2xl font-bold text-freedoc-dark m-0">6. Privacy and Data Protection</h2>
              </div>
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <p className="text-slate-600 mb-4">
                    Your privacy is protected under Australian Privacy Act and healthcare regulations:
                  </p>
                  <ul className="list-disc list-inside text-slate-600 space-y-2">
                    <li>Health information is confidential and securely stored</li>
                    <li>Data is only shared with authorized healthcare providers</li>
                    <li>You have rights to access and control your information</li>
                    <li>See our Privacy Policy for complete details</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6 text-freedoc-blue" />
                <h2 className="text-2xl font-bold text-freedoc-dark m-0">7. Intellectual Property</h2>
              </div>
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <p className="text-slate-600 mb-4">
                    The FreeDoc platform, including all content, features, and functionality, is owned by FreeDoc Australia and protected by copyright and trademark laws.
                  </p>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    <li>Users may not reproduce, distribute, or create derivative works</li>
                    <li>Medical documents issued to you remain your property</li>
                    <li>Platform usage is licensed, not sold, to users</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-6 w-6 text-freedoc-blue" />
                <h2 className="text-2xl font-bold text-freedoc-dark m-0">8. Governing Law and Disputes</h2>
              </div>
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <p className="text-slate-600 mb-4">
                    These terms are governed by Australian law, and any disputes will be resolved in Australian courts.
                  </p>
                  <div className="space-y-3">
                    <p className="text-slate-600">
                      <strong>Complaint Resolution:</strong> We encourage users to first contact our support team 
                      to resolve any issues. Unresolved complaints may be escalated to relevant health authorities.
                    </p>
                    <p className="text-slate-600">
                      <strong>Medical Complaints:</strong> Medical practice complaints can be made to AHPRA or 
                      relevant state health complaints commissions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-freedoc-dark mb-4">9. Contact Information</h2>
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <p className="text-slate-600 mb-4">
                    For questions about these Terms and Conditions, contact:
                  </p>
                  <div className="space-y-2 text-slate-600">
                    <p><strong>Legal Department:</strong> legal@freedoc.com.au</p>
                    <p><strong>General Inquiries:</strong> 1800 FREEDOC (1800 373 336)</p>
                    <p><strong>Address:</strong> FreeDoc Australia, Legal Department, PO Box 1234, Sydney NSW 2001</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-sm text-slate-600">
                <strong>Last Updated:</strong> January 11, 2025<br />
                <strong>Effective Date:</strong> January 11, 2025<br />
                These terms may be updated from time to time. Continued use of our services constitutes acceptance of any changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}