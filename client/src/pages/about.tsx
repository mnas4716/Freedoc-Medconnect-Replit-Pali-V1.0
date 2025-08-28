import { Heart, Shield, Clock, Users, Award, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Link } from "wouter";

export default function About() {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-freedoc-blue" />,
      title: "Patient-Centered Care",
      description: "We put your health and wellbeing at the center of everything we do, providing compassionate, personalized healthcare."
    },
    {
      icon: <Shield className="h-8 w-8 text-freedoc-blue" />,
      title: "Privacy & Security",
      description: "Your medical information is protected with industry-leading security measures and strict privacy protocols."
    },
    {
      icon: <Clock className="h-8 w-8 text-freedoc-blue" />,
      title: "Accessible Healthcare",
      description: "Quality healthcare should be available to everyone, anytime, anywhere across Australia."
    },
    {
      icon: <Users className="h-8 w-8 text-freedoc-blue" />,
      title: "Expert Network",
      description: "Our network of qualified Australian doctors are committed to providing the highest standard of care."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Patients Served" },
    { number: "150+", label: "Partner Doctors" },
    { number: "24/7", label: "Availability" },
    { number: "100%", label: "Free Services" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-freedoc-blue to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About FreeDoc</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            Revolutionizing healthcare accessibility across Australia with completely free, professional medical services
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Award className="h-6 w-6" />
            <span className="text-lg">AHPRA Regulated • Fully Licensed • Australian Doctors</span>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-freedoc-dark mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              FreeDoc was founded with a simple yet powerful mission: to make quality healthcare accessible to every Australian, 
              regardless of their financial situation or geographic location. We believe that basic medical care should never be 
              a privilege, but a fundamental right.
            </p>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none shadow-lg">
              <CardContent className="p-8">
                <blockquote className="text-xl italic text-freedoc-dark font-medium">
                  "Healthcare is not just about treating illness – it's about empowering people to live healthier, 
                  more fulfilling lives. That's why we've made our services completely free."
                </blockquote>
                <cite className="text-slate-600 mt-4 block">— Dr. Sarah Mitchell, Founder & Chief Medical Officer</cite>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-freedoc-dark mb-4">Our Impact</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Since our launch, we've been making a real difference in the lives of Australians nationwide
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-freedoc-blue mb-2">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-freedoc-dark mb-4">Our Values</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape how we serve our community
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {value.icon}
                    <CardTitle className="text-xl text-freedoc-dark">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-base leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How We're Different */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-freedoc-dark mb-4">How We're Different</h2>
              <p className="text-lg text-slate-600">
                FreeDoc stands apart from traditional healthcare providers in several important ways
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-freedoc-dark mb-2">Completely Free Services</h3>
                  <p className="text-slate-600">No consultation fees, no hidden costs, no bulk-billing requirements. Our services are 100% free for all Australians.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-freedoc-dark mb-2">Licensed Australian Doctors</h3>
                  <p className="text-slate-600">All our doctors are fully licensed, AHPRA-registered medical professionals practicing in Australia.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-freedoc-dark mb-2">Digital-First Approach</h3>
                  <p className="text-slate-600">Our platform is built for the modern world, providing convenient access to healthcare from anywhere.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-freedoc-dark mb-2">Comprehensive Services</h3>
                  <p className="text-slate-600">From prescriptions to mental health support, we offer a full range of primary healthcare services.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-freedoc-dark mb-6">Ready to Experience Free Healthcare?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Join thousands of Australians who have already discovered the convenience and quality of FreeDoc's services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-freedoc-blue hover:bg-blue-700">
                  Get Started Today
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg">
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}