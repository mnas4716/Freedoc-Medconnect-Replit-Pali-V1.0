import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Stethoscope,
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  ArrowLeft,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  Award,
  Activity,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

// Form schemas
const doctorSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  specialization: z.string().min(1, "Specialization is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  password: z.string().optional(),
});

export default function DoctorManagement() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);

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
      setIsAddDialogOpen(false);
      addForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create doctor",
        variant: "destructive",
      });
    },
  });

  // Update doctor mutation
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
      setIsEditDialogOpen(false);
      setEditingDoctor(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update doctor",
        variant: "destructive",
      });
    },
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

  // Forms
  const addForm = useForm<z.infer<typeof doctorSchema>>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      specialization: "",
      licenseNumber: "",
      password: "",
    },
  });

  const editForm = useForm<z.infer<typeof doctorSchema>>({
    resolver: zodResolver(doctorSchema.omit({ password: true })),
  });

  const onAddSubmit = (values: z.infer<typeof doctorSchema>) => {
    createDoctorMutation.mutate({
      ...values,
      role: "doctor",
      isActive: true,
    });
  };

  const onEditSubmit = (values: z.infer<typeof doctorSchema>) => {
    if (editingDoctor) {
      updateDoctorMutation.mutate({
        doctorId: editingDoctor.id,
        data: values
      });
    }
  };

  const openEditDialog = (doctor: any) => {
    setEditingDoctor(doctor);
    editForm.reset({
      firstName: doctor.firstName || "",
      lastName: doctor.lastName || "",
      email: doctor.email || "",
      specialization: doctor.specialization || "",
      licenseNumber: doctor.licenseNumber || "",
    });
    setIsEditDialogOpen(true);
  };

  // Mock data for fallback
  const mockDoctors = [
    {
      id: "dr.smith",
      email: "dr.smith@freedoc.com.au",
      firstName: "Dr. Sarah",
      lastName: "Smith",
      specialization: "General Practice",
      licenseNumber: "GP12345",
      isActive: true,
      workloadCount: 45,
      completedConsultations: 234,
      avgRating: 4.8,
      createdAt: "2024-01-15T08:00:00Z",
      lastActive: "2025-01-07T16:30:00Z",
      status: "active"
    },
    {
      id: "dr.johnson",
      email: "dr.johnson@freedoc.com.au",
      firstName: "Dr. Michael",
      lastName: "Johnson",
      specialization: "Mental Health",
      licenseNumber: "MH67890",
      isActive: true,
      workloadCount: 32,
      completedConsultations: 189,
      avgRating: 4.9,
      createdAt: "2024-02-20T09:30:00Z",
      lastActive: "2025-01-07T14:45:00Z",
      status: "active"
    }
  ];

  // Filter doctors
  const filteredDoctors = (doctors.length > 0 ? doctors : mockDoctors).filter((doctor: any) => {
    const matchesSearch = 
      (doctor.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.specialization || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || (doctor.isActive ? "active" : "inactive") === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getDoctorStatus = (doctor: any) => {
    return doctor.isActive ? "active" : "inactive";
  };

  // Calculate doctor statistics
  const totalDoctors = (doctors.length > 0 ? doctors : mockDoctors).length;
  const activeDoctors = (doctors.length > 0 ? doctors : mockDoctors).filter((d: any) => d.isActive !== false).length;
  const inactiveDoctors = (doctors.length > 0 ? doctors : mockDoctors).filter((d: any) => d.isActive === false).length;
  const totalConsultations = (doctors.length > 0 ? doctors : mockDoctors).reduce((sum: number, d: any) => sum + (d.completedConsultations || 0), 0);

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
                <Stethoscope className="h-8 w-8 text-freedoc-blue" />
                Doctor Management
              </h1>
              <p className="text-slate-600 mt-1">Manage doctor accounts and credentials</p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-freedoc-blue hover:bg-freedoc-blue/90 text-white">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
                <DialogDescription>
                  Create a new doctor account with credentials.
                </DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialization" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="General Practice">General Practice</SelectItem>
                              <SelectItem value="Mental Health">Mental Health</SelectItem>
                              <SelectItem value="Dermatology">Dermatology</SelectItem>
                              <SelectItem value="Cardiology">Cardiology</SelectItem>
                              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter license number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-freedoc-blue hover:bg-freedoc-blue/90"
                      disabled={createDoctorMutation.isPending}
                    >
                      {createDoctorMutation.isPending ? "Creating..." : "Create Doctor"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Doctors</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2">{totalDoctors}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Stethoscope className="h-6 w-6 text-freedoc-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Doctors</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{activeDoctors}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Inactive</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{inactiveDoctors}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Ban className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Consultations</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{totalConsultations}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Activity className="h-6 w-6 text-purple-600" />
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
                    placeholder="Search doctors by name, email, or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Doctors Table */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Doctor Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-semibold text-slate-700">Doctor ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">Doctor Details</TableHead>
                    <TableHead className="font-semibold text-slate-700">Specialization</TableHead>
                    <TableHead className="font-semibold text-slate-700">License</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Workload</TableHead>
                    <TableHead className="font-semibold text-slate-700">Rating</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctorsLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="h-8 w-8 animate-spin border-2 border-freedoc-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading doctors...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredDoctors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-slate-600">No doctors found.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDoctors.map((doctor: any) => (
                      <TableRow key={doctor.id} className="border-slate-100 hover:bg-slate-50/50">
                        <TableCell className="font-mono text-sm">{doctor.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{(doctor.firstName || '') + ' ' + (doctor.lastName || '')}</p>
                            <p className="text-sm text-slate-600">{doctor.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {doctor.specialization || 'General Practice'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{doctor.licenseNumber}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(doctor.isActive !== false)}>
                            {getDoctorStatus(doctor).charAt(0).toUpperCase() + getDoctorStatus(doctor).slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">{doctor.workloadCount || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{doctor.avgRating || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(doctor)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Details
                              </DropdownMenuItem>
                              {getDoctorStatus(doctor) === "active" ? (
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => updateDoctorMutation.mutate({ doctorId: doctor.id, data: { isActive: false } })}
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  className="text-green-600"
                                  onClick={() => updateDoctorMutation.mutate({ doctorId: doctor.id, data: { isActive: true } })}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => deleteDoctorMutation.mutate(doctor.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Doctor
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

        {/* Edit Doctor Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Doctor</DialogTitle>
              <DialogDescription>
                Update doctor account information.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Practice">General Practice</SelectItem>
                            <SelectItem value="Mental Health">Mental Health</SelectItem>
                            <SelectItem value="Dermatology">Dermatology</SelectItem>
                            <SelectItem value="Cardiology">Cardiology</SelectItem>
                            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter license number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setEditingDoctor(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-freedoc-blue hover:bg-freedoc-blue/90"
                    disabled={updateDoctorMutation.isPending}
                  >
                    {updateDoctorMutation.isPending ? "Updating..." : "Update Doctor"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}