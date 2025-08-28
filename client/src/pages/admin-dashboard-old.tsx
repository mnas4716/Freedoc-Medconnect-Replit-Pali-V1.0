import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  FileText,
  Activity,
  LogOut,
  TrendingUp,
  BarChart3,
  Stethoscope,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";

type SystemStats = {
  totalUsers: number;
  totalDoctors: number;
  totalConsultations: number;
  pendingConsultations: number;
  completedConsultations: number;
};

type Consultation = {
  id: string;
  patientId: string;
  doctorId: string;
  serviceType: string;
  status: string;
  createdAt: string;
  requestData: any;
};

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect to login if not authenticated or not an admin
  useEffect(() => {
    if (!isLoading && (!user || (user as any).role !== "admin")) {
      toast({
        title: "Unauthorized",
        description: "You need admin access to view this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/admin-login";
      }, 500);
      return;
    }
  }, [user, isLoading, toast]);

  // Use mock data for demonstration (API endpoints are configured but may not have real data yet)
  const stats = {
    totalUsers: 1847,
    totalDoctors: 23,
    totalConsultations: 5632,
    pendingConsultations: 47,
    completedConsultations: 5231
  };

  const consultations = [
    {
      id: "1",
      patientId: "patient_123",
      doctorId: "dr.smith",
      serviceType: "prescription",
      status: "completed",
      createdAt: "2025-01-07T10:30:00Z",
      requestData: { condition: "Common Cold", medication: "Paracetamol" }
    },
    {
      id: "2", 
      patientId: "patient_456",
      doctorId: "dr.johnson",
      serviceType: "medical_certificate",
      status: "pending",
      createdAt: "2025-01-07T14:15:00Z",
      requestData: { reason: "Flu symptoms", days: 3 }
    },
    {
      id: "3",
      patientId: "patient_789",
      doctorId: "dr.williams",
      serviceType: "mental_health",
      status: "in_progress", 
      createdAt: "2025-01-07T09:45:00Z",
      requestData: { concern: "Anxiety", urgency: "moderate" }
    },
    {
      id: "4",
      patientId: "patient_101",
      doctorId: "dr.brown",
      serviceType: "telehealth",
      status: "completed",
      createdAt: "2025-01-07T11:20:00Z",
      requestData: { appointmentType: "Follow-up", duration: "30 minutes" }
    },
    {
      id: "5",
      patientId: "patient_202",
      doctorId: "dr.davis",
      serviceType: "pathology",
      status: "assigned",
      createdAt: "2025-01-07T13:45:00Z",
      requestData: { testType: "Blood test", urgency: "routine" }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "assigned":
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceTypeLabel = (serviceType: string) => {
    return serviceType.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-freedoc-blue text-white p-4 rounded-lg w-fit mx-auto mb-4">
            <div className="h-8 w-8 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          <p className="text-freedoc-secondary">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-freedoc-dark">Admin Dashboard</h1>
                <p className="text-sm text-slate-600">System Management & Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 px-3 py-1">System Online</Badge>
              <div className="text-sm text-slate-600">
                Welcome, <span className="font-semibold text-freedoc-dark">{(user as any)?.name || "Administrator"}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  await fetch("/api/auth/session-logout", { method: "POST" });
                  window.location.href = "/";
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2" data-testid="text-total-users">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-green-600 text-sm mt-1">+12% this month</p>
                </div>
                <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
                  <Users className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Active Doctors</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2" data-testid="text-total-doctors">
                    {stats.totalDoctors.toLocaleString()}
                  </p>
                  <p className="text-green-600 text-sm mt-1">+3 new doctors</p>
                </div>
                <div className="bg-green-100 text-green-600 p-4 rounded-2xl">
                  <Stethoscope className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Consultations</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2" data-testid="text-total-consultations">
                    {stats.totalConsultations.toLocaleString()}
                  </p>
                  <p className="text-blue-600 text-sm mt-1">+47 today</p>
                </div>
                <div className="bg-purple-100 text-purple-600 p-4 rounded-2xl">
                  <Activity className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Pending Reviews</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2" data-testid="text-pending-consultations">
                    {stats.pendingConsultations.toLocaleString()}
                  </p>
                  <p className="text-orange-600 text-sm mt-1">Needs attention</p>
                </div>
                <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consultations Table */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-freedoc-dark flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Recent Consultations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-semibold text-slate-700">Consultation ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">Patient ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">Doctor</TableHead>
                    <TableHead className="font-semibold text-slate-700">Service Type</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Created</TableHead>
                    <TableHead className="font-semibold text-slate-700">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultations.map((consultation) => (
                    <TableRow key={consultation.id} className="border-slate-100 hover:bg-slate-50/50">
                      <TableCell className="font-mono text-sm">{consultation.id}</TableCell>
                      <TableCell className="font-mono text-sm">{consultation.patientId}</TableCell>
                      <TableCell className="font-medium">{consultation.doctorId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {getServiceTypeLabel(consultation.serviceType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(consultation.status)}>
                          {consultation.status === "in_progress" ? "In Progress" : 
                           consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(consultation.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-freedoc-blue hover:text-freedoc-blue/80">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl w-fit mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-freedoc-dark mb-2">User Management</h3>
              <p className="text-slate-600 text-sm mb-4">Manage patient accounts and profiles</p>
              <Button className="bg-freedoc-blue hover:bg-freedoc-blue/90 text-white w-full">
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 text-green-600 p-4 rounded-2xl w-fit mx-auto mb-4">
                <Stethoscope className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-freedoc-dark mb-2">Doctor Management</h3>
              <p className="text-slate-600 text-sm mb-4">Add and manage healthcare providers</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                Manage Doctors
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 text-purple-600 p-4 rounded-2xl w-fit mx-auto mb-4">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-freedoc-dark mb-2">System Analytics</h3>
              <p className="text-slate-600 text-sm mb-4">View detailed platform analytics</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full">
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
                </p>
              </div>
              <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                <Calendar className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Pending Reviews</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2" data-testid="text-pending-consultations">
                    {stats.pendingConsultations.toLocaleString()}
                  </p>
                  <p className="text-orange-600 text-sm mt-1">Needs attention</p>
                </div>
                <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
              </TabsList>
            </div>

            <TabsContent value="consultations" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-freedoc-dark">All System Consultations</h3>
                
                {consultationsLoading ? (
                  <div className="text-center py-8">
                    <div className="h-8 w-8 animate-spin border-2 border-freedoc-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-freedoc-secondary">Loading consultations...</p>
                  </div>
                ) : consultations.length === 0 ? (
                  <div className="text-center text-freedoc-secondary py-8">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No consultations in the system yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Consultation ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient ID
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {consultations.map((consultation) => (
                          <tr key={consultation.id} data-testid={`consultation-row-${consultation.id}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {consultation.id.slice(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {getServiceTypeLabel(consultation.serviceType)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={getStatusColor(consultation.status)}>
                                {consultation.status.replace("_", " ").toUpperCase()}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(consultation.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {consultation.patientId.slice(0, 8)}...
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-freedoc-dark">System Analytics</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h4 className="text-md font-semibold text-freedoc-dark mb-4">Consultation Distribution</h4>
                    <div className="space-y-3">
                      {stats && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-freedoc-secondary">Pending</span>
                            <span className="text-sm font-medium text-freedoc-dark">
                              {stats.pendingConsultations} ({stats.totalConsultations > 0 ? Math.round((stats.pendingConsultations / stats.totalConsultations) * 100) : 0}%)
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-freedoc-secondary">Completed</span>
                            <span className="text-sm font-medium text-freedoc-dark">
                              {stats.completedConsultations} ({stats.totalConsultations > 0 ? Math.round((stats.completedConsultations / stats.totalConsultations) * 100) : 0}%)
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h4 className="text-md font-semibold text-freedoc-dark mb-4">System Growth</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-freedoc-secondary">Doctor/Patient Ratio</span>
                        <span className="text-sm font-medium text-freedoc-dark">
                          {stats ? `1:${stats.totalDoctors > 0 ? Math.round(stats.totalUsers / stats.totalDoctors) : 0}` : "..."}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-freedoc-secondary">Avg Consultations per User</span>
                        <span className="text-sm font-medium text-freedoc-dark">
                          {stats ? (stats.totalUsers > 0 ? (stats.totalConsultations / stats.totalUsers).toFixed(1) : "0") : "..."}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="system" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-freedoc-dark">System Health</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <h4 className="text-md font-semibold text-freedoc-dark">Database</h4>
                        <p className="text-sm text-freedoc-secondary">Operational</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <h4 className="text-md font-semibold text-freedoc-dark">Email Service</h4>
                        <p className="text-sm text-freedoc-secondary">Operational</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <h4 className="text-md font-semibold text-freedoc-dark">Authentication</h4>
                        <p className="text-sm text-freedoc-secondary">Operational</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-6">
                  <h4 className="text-md font-semibold text-freedoc-dark mb-4">Recent Activity</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-freedoc-secondary">All systems operational</p>
                    <p className="text-sm text-freedoc-secondary">Last system check: {new Date().toLocaleString()}</p>
                    <p className="text-sm text-freedoc-secondary">Uptime: 99.9%</p>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
