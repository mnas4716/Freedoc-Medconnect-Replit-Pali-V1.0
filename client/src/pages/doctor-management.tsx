import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Stethoscope,
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  Award,
  Clock,
  Activity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

type Doctor = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  isActive: boolean;
  workloadCount: number;
  completedConsultations: number;
  avgRating: number;
  createdAt: string;
  lastActive?: string;
  status: 'active' | 'inactive' | 'on_leave';
};

export default function DoctorManagement() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || (user as any).role !== "admin")) {
      toast({
        title: "Unauthorized",
        description: "Admin access required",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/admin-login";
      }, 500);
    }
  }, [user, isLoading, toast]);

  // Fetch doctors from API
  const { data: doctors = [], isLoading: doctorsLoading } = useQuery({
    queryKey: ['/api/admin/doctors'],
    enabled: !isLoading && (user as any)?.role === "admin",
  });

  // Delete doctor mutation
  const deleteDoctorMutation = useMutation({
    mutationFn: async (doctorId: string) => {
      return apiRequest(`/api/admin/doctors/${doctorId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Doctor deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/doctors'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete doctor",
        variant: "destructive",
      });
    },
  });

  // Update doctor status mutation
  const updateDoctorMutation = useMutation({
    mutationFn: async ({ doctorId, data }: { doctorId: string, data: any }) => {
      return apiRequest(`/api/admin/doctors/${doctorId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Success", 
        description: "Doctor updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/doctors'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update doctor",
        variant: "destructive",
      });
    },
  });

  // Create doctor mutation
  const createDoctorMutation = useMutation({
    mutationFn: async (doctorData: any) => {
      return apiRequest('/api/admin/doctors', {
        method: 'POST',
        body: JSON.stringify(doctorData)
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Doctor created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/doctors'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create doctor",
        variant: "destructive",
      });
    },
  });

  // Mock data for doctors fallback
  const mockDoctors: Doctor[] = [
    {
      id: "dr.smith",
      email: "dr.smith@freedoc.com.au",
      firstName: "Dr. Sarah",
      lastName: "Smith",
      specialization: "General Practice",
      licenseNumber: "MED12345",
      isActive: true,
      workloadCount: 12,
      completedConsultations: 1247,
      avgRating: 4.8,
      createdAt: "2024-01-15T10:30:00Z",
      lastActive: "2025-01-07T14:20:00Z",
      status: "active"
    },
    {
      id: "dr.johnson",
      email: "dr.johnson@freedoc.com.au",
      firstName: "Dr. Michael",
      lastName: "Johnson",
      specialization: "Mental Health",
      licenseNumber: "MED12346",
      isActive: true,
      workloadCount: 8,
      completedConsultations: 892,
      avgRating: 4.9,
      createdAt: "2024-02-20T09:15:00Z",
      lastActive: "2025-01-07T11:45:00Z",
      status: "active"
    },
    {
      id: "dr.williams",
      email: "dr.williams@freedoc.com.au",
      firstName: "Dr. Emma",
      lastName: "Williams",
      specialization: "Internal Medicine",
      licenseNumber: "MED12347",
      isActive: false,
      workloadCount: 0,
      completedConsultations: 567,
      avgRating: 4.7,
      createdAt: "2024-03-10T16:30:00Z",
      lastActive: "2024-12-20T08:30:00Z",
      status: "on_leave"
    },
    {
      id: "dr.brown",
      email: "dr.brown@freedoc.com.au",
      firstName: "Dr. James",
      lastName: "Brown",
      specialization: "Dermatology",
      licenseNumber: "MED12348",
      isActive: true,
      workloadCount: 15,
      completedConsultations: 1089,
      avgRating: 4.6,
      createdAt: "2024-04-05T13:20:00Z",
      lastActive: "2025-01-07T16:15:00Z",
      status: "active"
    },
    {
      id: "dr.davis",
      email: "dr.davis@freedoc.com.au",
      firstName: "Dr. Olivia",
      lastName: "Davis",
      specialization: "Pediatrics",
      licenseNumber: "MED12349",
      isActive: true,
      workloadCount: 6,
      completedConsultations: 743,
      avgRating: 4.9,
      createdAt: "2024-05-12T12:45:00Z",
      lastActive: "2025-01-07T13:30:00Z",
      status: "active"
    }
  ];

  const filteredDoctors = (doctors.length > 0 ? doctors : mockDoctors).filter((doctor: any) => {
    const matchesSearch = 
      doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || doctor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string, isActive: boolean) => {
    if (!isActive) return "bg-red-100 text-red-800";
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "on_leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getDoctorStatus = (doctor: any) => {
    if (!doctor.isActive) return "inactive";
    return doctor.status || "active";
  };

  // Calculate doctor statistics
  const totalDoctors = (doctors.length > 0 ? doctors : mockDoctors).length;
  const activeDoctors = (doctors.length > 0 ? doctors : mockDoctors).filter((d: any) => d.isActive !== false).length;
  const inactiveDoctors = (doctors.length > 0 ? doctors : mockDoctors).filter((d: any) => d.isActive === false).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3" />;
      case "inactive":
        return <Ban className="h-3 w-3" />;
      case "on_leave":
        return <Calendar className="h-3 w-3" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500 text-white p-4 rounded-lg w-fit mx-auto mb-4">
            <div className="h-8 w-8 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          <p className="text-slate-600">Loading doctor management...</p>
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
              <Link href="/admin-dashboard">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-freedoc-blue">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-freedoc-dark">Doctor Management</h1>
                  <p className="text-sm text-slate-600">Manage healthcare providers and specialists</p>
                </div>
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Doctor
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Doctors</p>
                  <p className="text-2xl font-bold text-freedoc-dark mt-1">23</p>
                </div>
                <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                  <Stethoscope className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Active Now</p>
                  <p className="text-2xl font-bold text-freedoc-dark mt-1">19</p>
                </div>
                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Avg Workload</p>
                  <p className="text-2xl font-bold text-freedoc-dark mt-1">8.2</p>
                </div>
                <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Avg Rating</p>
                  <p className="text-2xl font-bold text-freedoc-dark mt-1">4.8</p>
                </div>
                <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl">
                  <Award className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50 mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle className="text-xl font-bold text-freedoc-dark">Healthcare Providers</CardTitle>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-semibold text-slate-700">Doctor</TableHead>
                    <TableHead className="font-semibold text-slate-700">Specialization</TableHead>
                    <TableHead className="font-semibold text-slate-700">License</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Current Workload</TableHead>
                    <TableHead className="font-semibold text-slate-700">Completed</TableHead>
                    <TableHead className="font-semibold text-slate-700">Rating</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id} className="border-slate-100 hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                            {doctor.firstName.split(' ')[1].charAt(0)}{doctor.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-freedoc-dark">{doctor.firstName} {doctor.lastName}</p>
                            <p className="text-sm text-slate-500">{doctor.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {doctor.specialization}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{doctor.licenseNumber}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(doctor.status)} flex items-center space-x-1 w-fit`}>
                          {getStatusIcon(doctor.status)}
                          <span className="capitalize">{doctor.status.replace('_', ' ')}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            doctor.workloadCount > 12 ? 'bg-red-500' : 
                            doctor.workloadCount > 8 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}></div>
                          <span className="font-medium">{doctor.workloadCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{doctor.completedConsultations.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{doctor.avgRating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center space-x-2">
                              <Eye className="h-4 w-4" />
                              <span>View Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center space-x-2">
                              <Edit className="h-4 w-4" />
                              <span>Edit Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center space-x-2">
                              <Activity className="h-4 w-4" />
                              <span>View Workload</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center space-x-2 text-orange-600">
                              <Calendar className="h-4 w-4" />
                              <span>Set Leave</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center space-x-2 text-red-600">
                              <Ban className="h-4 w-4" />
                              <span>Deactivate</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}