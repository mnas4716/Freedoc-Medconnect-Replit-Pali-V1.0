import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  ClipboardList,
  Search,
  Filter,
  ArrowLeft,
  MoreVertical,
  Eye,
  UserCheck,
  Clock,
  FileText,
  Stethoscope,
  Brain,
  Video,
  Activity,
  Calendar,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";

export default function AdminRequests() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

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

  // Fetch requests from API
  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['/api/admin/requests'],
    enabled: !isLoading && (user as any)?.role === "admin",
  });

  // Fetch doctors for reassignment
  const { data: doctors = [] } = useQuery({
    queryKey: ['/api/admin/doctors'],
    enabled: !isLoading && (user as any)?.role === "admin",
  });

  // Reassign mutation
  const reassignMutation = useMutation({
    mutationFn: async ({ requestId, doctorId }: { requestId: string, doctorId: string }) => {
      return apiRequest(`/api/admin/requests/${requestId}/reassign`, {
        method: 'PUT',
        body: JSON.stringify({ doctorId })
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Request reassigned successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/requests'] });
      setIsReassignDialogOpen(false);
      setSelectedRequest(null);
      setSelectedDoctorId("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reassign request",
        variant: "destructive",
      });
    },
  });

  const openReassignDialog = (request: any) => {
    setSelectedRequest(request);
    setSelectedDoctorId(request.doctorId || "");
    setIsReassignDialogOpen(true);
  };

  const handleReassign = () => {
    if (selectedRequest && selectedDoctorId) {
      reassignMutation.mutate({
        requestId: selectedRequest.id,
        doctorId: selectedDoctorId
      });
    }
  };

  // Mock data for fallback
  const mockRequests = [
    {
      id: "REQ001",
      patientId: "46083104",
      patientName: "Moey Nasr",
      patientEmail: "moey.nasr@gmail.com",
      doctorId: "dr.smith",
      doctorName: "Dr. Sarah Smith",
      serviceType: "prescription",
      status: "assigned",
      requestData: {
        medication: "Paracetamol",
        dosage: "500mg",
        reason: "Headache"
      },
      createdAt: "2025-01-11T10:30:00Z",
      updatedAt: "2025-01-11T10:30:00Z"
    },
    {
      id: "REQ002",
      patientId: "user123",
      patientName: "Jane Smith",
      patientEmail: "jane.smith@example.com",
      doctorId: "dr.johnson",
      doctorName: "Dr. Michael Johnson",
      serviceType: "medical_certificate",
      status: "in_progress",
      requestData: {
        certificate_type: "sick_leave",
        date_from: "2025-01-11",
        date_to: "2025-01-13",
        symptoms: "Flu symptoms"
      },
      createdAt: "2025-01-11T14:15:00Z",
      updatedAt: "2025-01-11T16:20:00Z"
    }
  ];

  // Filter requests
  const filteredRequests = (requests.length > 0 ? requests : mockRequests).filter((request: any) => {
    const matchesSearch = 
      (request.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.patientEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesService = serviceFilter === "all" || request.serviceType === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case "prescription":
        return <FileText className="h-4 w-4" />;
      case "medical_certificate":
        return <ClipboardList className="h-4 w-4" />;
      case "mental_health":
        return <Brain className="h-4 w-4" />;
      case "telehealth":
        return <Video className="h-4 w-4" />;
      case "pathology":
        return <Activity className="h-4 w-4" />;
      default:
        return <Stethoscope className="h-4 w-4" />;
    }
  };

  // Calculate statistics
  const totalRequests = (requests.length > 0 ? requests : mockRequests).length;
  const pendingRequests = (requests.length > 0 ? requests : mockRequests).filter((r: any) => r.status === "pending").length;
  const assignedRequests = (requests.length > 0 ? requests : mockRequests).filter((r: any) => r.status === "assigned").length;
  const completedRequests = (requests.length > 0 ? requests : mockRequests).filter((r: any) => r.status === "completed").length;

  if (isLoading || (!user || (user as any).role !== "admin")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin-dashboard">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-freedoc-blue">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <ClipboardList className="h-8 w-8 text-freedoc-blue" />
                Request Management
              </h1>
              <p className="text-slate-600 mt-1">Monitor and manage all patient requests</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Requests</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2">{totalRequests}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ClipboardList className="h-6 w-6 text-freedoc-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingRequests}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Assigned</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{assignedRequests}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{completedRequests}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search requests by patient, doctor, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="prescription">Prescription</SelectItem>
                  <SelectItem value="medical_certificate">Medical Certificate</SelectItem>
                  <SelectItem value="mental_health">Mental Health</SelectItem>
                  <SelectItem value="telehealth">Telehealth</SelectItem>
                  <SelectItem value="pathology">Pathology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">All Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-semibold text-slate-700">Request ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">Patient</TableHead>
                    <TableHead className="font-semibold text-slate-700">Service</TableHead>
                    <TableHead className="font-semibold text-slate-700">Assigned Doctor</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Submitted</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requestsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="h-8 w-8 animate-spin border-2 border-freedoc-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading requests...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-slate-600">No requests found.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request: any) => (
                      <TableRow key={request.id} className="border-slate-100 hover:bg-slate-50/50">
                        <TableCell className="font-mono text-sm">{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.patientName || 'Unknown Patient'}</p>
                            <p className="text-sm text-slate-600">{request.patientEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getServiceIcon(request.serviceType)}
                            <span className="capitalize">{request.serviceType?.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">{request.doctorName || 'Unassigned'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setLocation(`/admin/request/${request.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openReassignDialog(request)}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Reassign Doctor
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Reassign Dialog */}
        <Dialog open={isReassignDialogOpen} onOpenChange={setIsReassignDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reassign Request</DialogTitle>
              <DialogDescription>
                Select a new doctor to assign this request to.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Request</label>
                <p className="text-sm text-slate-600">
                  {selectedRequest?.id} - {selectedRequest?.serviceType?.replace('_', ' ')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Select Doctor</label>
                <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.length > 0 ? doctors.map((doctor: any) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                      </SelectItem>
                    )) : (
                      <>
                        <SelectItem value="dr.smith">Dr. Sarah Smith - General Practice</SelectItem>
                        <SelectItem value="dr.johnson">Dr. Michael Johnson - Mental Health</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsReassignDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleReassign}
                disabled={!selectedDoctorId || reassignMutation.isPending}
                className="bg-freedoc-blue hover:bg-freedoc-blue/90"
              >
                {reassignMutation.isPending ? "Reassigning..." : "Reassign"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}