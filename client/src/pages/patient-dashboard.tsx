import { useState } from "react";
import { Pill, FileText, Brain, Stethoscope, TestTube2, Clock, CheckCircle, Calendar, Download, User, Settings, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ServiceFormModal } from "@/components/ui/service-form-modal";
import { Navbar } from "@/components/layout/navbar";

const services = [
  {
    id: "prescription",
    name: "Online Prescription",
    icon: <Pill className="h-6 w-6" />,
    description: "Renew your regular medications online",
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-50 to-indigo-50",
  },
  {
    id: "medical_certificate",
    name: "Medical Certificate",
    icon: <FileText className="h-6 w-6" />,
    description: "Get medical certificates for work or study",
    gradient: "from-emerald-500 to-emerald-600",
    bgGradient: "from-emerald-50 to-teal-50",
  },
  {
    id: "mental_health",
    name: "Mental Health Support",
    icon: <Brain className="h-6 w-6" />,
    description: "Access mental health care plans and support",
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-violet-50",
  },
  {
    id: "telehealth",
    name: "Telehealth Consultation",
    icon: <Stethoscope className="h-6 w-6" />,
    description: "Speak to an Australian Partner Doctor online",
    gradient: "from-orange-500 to-orange-600",
    bgGradient: "from-orange-50 to-amber-50",
  },
  {
    id: "pathology",
    name: "Pathology Referral",
    icon: <TestTube2 className="h-6 w-6" />,
    description: "Online referrals for pathology tests",
    gradient: "from-rose-500 to-rose-600",
    bgGradient: "from-rose-50 to-pink-50",
  },
];

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

const mockConsultations = [
  {
    id: "1",
    serviceType: "prescription",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    doctorNotes: "Prescription renewed for 3 months. Continue current dosage.",
    requestData: { medication: "Lipitor 20mg", reason: "Cholesterol management" }
  },
  {
    id: "2", 
    serviceType: "medical_certificate",
    status: "pending",
    createdAt: "2024-01-16T14:20:00Z",
    requestData: { duration: "3 days", reason: "Flu symptoms" }
  },
  {
    id: "3",
    serviceType: "telehealth",
    status: "in_progress",
    createdAt: "2024-01-16T16:00:00Z",
    requestData: { symptoms: "Persistent headaches", duration: "1 week" }
  }
];

export default function PatientDashboard() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch user's consultations
  const { data: consultations, isLoading: consultationsLoading } = useQuery({
    queryKey: ["/api/consultations"],
    enabled: !!user,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getServiceIcon = (serviceType: string) => {
    const service = services.find(s => s.id === serviceType);
    return service ? service.icon : <FileText className="h-4 w-4" />;
  };

  const getServiceName = (serviceType: string) => {
    const service = services.find(s => s.id === serviceType);
    return service ? service.name : serviceType;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-freedoc-blue/20">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-freedoc-blue to-blue-600 text-white text-xl font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-freedoc-dark">Welcome back, John</h1>
                <p className="text-freedoc-secondary">Patient Dashboard</p>
              </div>
            </div>
            {/* Profile actions moved to navbar component */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="services" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Request Service</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Consultation History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-8">
            {/* Services Section */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-freedoc-dark mb-4">
                  Choose Your{" "}
                  <span className="bg-gradient-to-r from-freedoc-blue to-indigo-600 bg-clip-text text-transparent">
                    Healthcare Service
                  </span>
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  All services are completely free and provided by qualified Australian Partner Doctors
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br ${service.bgGradient} border-white/50 backdrop-blur-sm relative overflow-hidden`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${service.gradient} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                          {service.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-freedoc-dark">{service.name}</CardTitle>
                        </div>
                      </div>
                      <CardDescription className="text-slate-600 leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <Button className={`w-full bg-gradient-to-r ${service.gradient} hover:shadow-lg text-white font-semibold transition-all duration-300`}>
                        Request Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-freedoc-dark mb-6">Recent Consultations</h2>
              
              {mockConsultations.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No consultations yet</p>
                    <p className="text-sm text-slate-500 mt-2">Request your first service to get started</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {mockConsultations.map((consultation) => (
                    <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-slate-100 rounded-lg">
                              {getServiceIcon(consultation.serviceType)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-freedoc-dark">
                                {getServiceName(consultation.serviceType)}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {new Date(consultation.createdAt).toLocaleDateString('en-AU', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={getStatusColor(consultation.status)}>
                              {consultation.status === "in_progress" ? "In Progress" : consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                            </Badge>
                            {consultation.status === "completed" && (
                              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                                <Download className="h-3 w-3" />
                                <span>Download</span>
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {consultation.doctorNotes && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-800">
                              <span className="font-medium">Doctor's Notes: </span>
                              {consultation.doctorNotes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Service Request Modal */}
      {selectedService && (
        <ServiceFormModal
          serviceType={selectedService}
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          onSubmit={(formData) => {
            // Handle form submission
            console.log("Form submitted:", { serviceType: selectedService, formData });
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
}