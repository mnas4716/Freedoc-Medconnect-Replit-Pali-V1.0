import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Stethoscope,
  Activity,
  Clock,
  Shield,
  LogOut,
  FileText,
  AlertCircle,
  CheckCircle,
  BarChart3,
  ClipboardList,
  Calendar,
  UserCog,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

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

  // Check admin session
  const { data: sessionUser } = useQuery({
    queryKey: ['/api/auth/session-user'],
    retry: false,
  });

  // Redirect to login if not authenticated or not an admin
  useEffect(() => {
    if (!isLoading && (!user || (user as any).role !== "admin") && !sessionUser) {
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
  }, [user, isLoading, toast, sessionUser]);

  // Fetch system stats from API
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: !isLoading && ((user as any)?.role === "admin" || !!sessionUser),
  });

  // Fetch consultations from API
  const { data: consultations = [], isLoading: consultationsLoading } = useQuery({
    queryKey: ['/api/admin/consultations'],
    enabled: !isLoading && ((user as any)?.role === "admin" || !!sessionUser),
  });

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

  if (isLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-blue-500 text-white p-4 rounded-lg w-fit mx-auto mb-4">
            <div className="h-8 w-8 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          <p className="text-slate-600">Loading admin dashboard...</p>
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
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                System Online
              </Badge>
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
          {/* Total Users */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2" data-testid="text-total-users">
                    {statsLoading ? "..." : (stats as any)?.totalUsers?.toLocaleString() || "0"}
                  </p>
                  <p className="text-green-600 text-sm mt-1">+12% this month</p>
                </div>
                <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
                  <Users className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Doctors */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Active Doctors</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2" data-testid="text-total-doctors">
                    {statsLoading ? "..." : (stats as any)?.totalDoctors?.toLocaleString() || "0"}
                  </p>
                  <p className="text-green-600 text-sm mt-1">+3 new doctors</p>
                </div>
                <div className="bg-green-100 text-green-600 p-4 rounded-2xl">
                  <Stethoscope className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Consultations */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Consultations</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2" data-testid="text-total-consultations">
                    {statsLoading ? "..." : (stats as any)?.totalConsultations?.toLocaleString() || "0"}
                  </p>
                  <p className="text-blue-600 text-sm mt-1">+47 today</p>
                </div>
                <div className="bg-purple-100 text-purple-600 p-4 rounded-2xl">
                  <Activity className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Reviews */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Pending Reviews</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2" data-testid="text-pending-consultations">
                    {statsLoading ? "..." : (stats as any)?.pendingConsultations?.toLocaleString() || "0"}
                  </p>
                  <p className="text-orange-600 text-sm mt-1">Needs attention</p>
                </div>
                <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl">
                  <AlertCircle className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consultations Table */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50 mb-8">
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
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultationsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="h-8 w-8 animate-spin border-2 border-freedoc-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading consultations...</p>
                      </TableCell>
                    </TableRow>
                  ) : (consultations as any[]).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-slate-600">No consultations found.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (consultations as any[]).map((consultation: any) => (
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
                          View Details
                        </Button>
                      </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl w-fit mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-freedoc-dark mb-2">User Management</h3>
              <p className="text-slate-600 text-sm mb-4">Manage patient accounts and profiles</p>
              <Button 
                className="bg-freedoc-blue hover:bg-freedoc-blue/90 text-white w-full"
                onClick={() => window.location.href = "/user-management"}
              >
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
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white w-full"
                onClick={() => window.location.href = "/doctor-management"}
              >
                Manage Doctors
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 text-purple-600 p-4 rounded-2xl w-fit mx-auto mb-4">
                <ClipboardList className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-freedoc-dark mb-2">Request Management</h3>
              <p className="text-slate-600 text-sm mb-4">View and reassign patient requests</p>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                onClick={() => window.location.href = "/admin-requests"}
              >
                Manage Requests
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
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                onClick={() => window.location.href = "/system-analytics"}
              >
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}