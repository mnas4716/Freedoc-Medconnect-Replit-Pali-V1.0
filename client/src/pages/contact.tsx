import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: ""
  });
  const { toast } = useToast();

  const contactMethods = [
    {
      icon: <Phone className="h-8 w-8 text-freedoc-blue" />,
      title: "Phone Support",
      description: "Speak directly with our support team",
      value: "1800 FREEDOC",
      link: "tel:1800373336",
      availability: "24/7 for urgent medical matters"
    },
    {
      icon: <Mail className="h-8 w-8 text-freedoc-blue" />,
      title: "Email Support",
      description: "Send us your questions and concerns",
      value: "support@freedoc.com.au",
      link: "mailto:support@freedoc.com.au",
      availability: "Response within 24 hours"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-freedoc-blue" />,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      value: "Available on website",
      link: "#",
      availability: "Mon-Fri 9AM-6PM AEDT"
    }
  ];

  const faqs = [
    {
      question: "How are your services completely free?",
      answer: "FreeDoc is funded through partnerships with healthcare organizations and government initiatives focused on improving healthcare accessibility."
    },
    {
      question: "Are your doctors qualified?",
      answer: "Yes, all our doctors are AHPRA-registered medical professionals licensed to practice in Australia."
    },
    {
      question: "What if I need urgent care?",
      answer: "For medical emergencies, please call 000. For urgent but non-emergency care, our 24/7 phone line connects you to available doctors."
    },
    {
      question: "Can I get prescriptions for any medication?",
      answer: "Our doctors can prescribe most medications within their scope of practice. Controlled substances and specialized medications may require in-person consultation."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll respond within 24 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "", category: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-freedoc-blue to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            We're here to help with any questions about our free healthcare services
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-freedoc-dark mb-4">Get in Touch</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose the method that works best for you. Our support team is ready to assist with any questions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {method.icon}
                  </div>
                  <CardTitle className="text-xl text-freedoc-dark">{method.title}</CardTitle>
                  <CardDescription className="text-slate-600">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a 
                    href={method.link}
                    className="text-lg font-semibold text-freedoc-blue hover:text-blue-700 block mb-2"
                  >
                    {method.value}
                  </a>
                  <p className="text-sm text-slate-500">{method.availability}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-freedoc-dark mb-4">Send Us a Message</h2>
              <p className="text-lg text-slate-600">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>
            
            <Card className="border-slate-200 shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-slate-700">
                      Category
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="medical">Medical Question</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-slate-700">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="mt-1"
                      placeholder="Brief subject line"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-slate-700">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-1"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-freedoc-blue hover:bg-blue-700" size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-freedoc-dark mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Quick answers to common questions about FreeDoc
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-start space-x-3 text-lg text-freedoc-dark">
                    <HelpCircle className="h-5 w-5 text-freedoc-blue mt-0.5 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-12">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-freedoc-dark mb-4">Service Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-xl text-freedoc-dark">
                    <MapPin className="h-6 w-6 text-freedoc-blue" />
                    <span>Service Area</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    FreeDoc provides services to all of Australia through our digital platform.
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• All Australian states and territories</li>
                    <li>• Remote and regional areas welcome</li>
                    <li>• No geographic restrictions</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-xl text-freedoc-dark">
                    <Clock className="h-6 w-6 text-freedoc-blue" />
                    <span>Support Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-freedoc-dark">Emergency Medical</div>
                      <div className="text-slate-600">24/7 - Always available</div>
                    </div>
                    <div>
                      <div className="font-medium text-freedoc-dark">General Support</div>
                      <div className="text-slate-600">Mon-Fri 9AM-6PM AEDT</div>
                    </div>
                    <div>
                      <div className="font-medium text-freedoc-dark">Online Services</div>
                      <div className="text-slate-600">Available 24/7</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}