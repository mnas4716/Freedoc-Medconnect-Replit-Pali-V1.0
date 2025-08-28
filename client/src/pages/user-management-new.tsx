import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Users,
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
const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  medicareNumber: z.string().optional(),
});

export default function UserManagement() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

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

  // Fetch users from API
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: !isLoading && (user as any)?.role === "admin",
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      return apiRequest('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setIsAddDialogOpen(false);
      addForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string, data: any }) => {
      return apiRequest(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Success", 
        description: "User updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setIsEditDialogOpen(false);
      setEditingUser(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  // Forms
  const addForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      medicareNumber: "",
    },
  });

  const editForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });

  const onAddSubmit = (values: z.infer<typeof userSchema>) => {
    createUserMutation.mutate({
      ...values,
      role: "patient",
      isEmailVerified: true,
    });
  };

  const onEditSubmit = (values: z.infer<typeof userSchema>) => {
    if (editingUser) {
      updateUserMutation.mutate({
        userId: editingUser.id,
        data: values
      });
    }
  };

  const openEditDialog = (user: any) => {
    setEditingUser(user);
    editForm.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      dateOfBirth: user.dateOfBirth || "",
      medicareNumber: user.medicareNumber || "",
    });
    setIsEditDialogOpen(true);
  };

  // Filter users
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = 
      (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || (user.role || 'patient') === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string, isEmailVerified: boolean) => {
    if (!isEmailVerified) return "bg-yellow-100 text-yellow-800";
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getUserStatus = (user: any) => {
    if (!user || !user.isEmailVerified) return "pending";
    return user.status || "active";
  };

  // Calculate user statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((u: any) => u.isEmailVerified && (u.status !== 'suspended')).length;
  const suspendedUsers = users.filter((u: any) => u.status === 'suspended').length;
  const pendingUsers = users.filter((u: any) => !u.isEmailVerified).length;

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
                <Users className="h-8 w-8 text-freedoc-blue" />
                User Management
              </h1>
              <p className="text-slate-600 mt-1">Manage user accounts and permissions</p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-freedoc-blue hover:bg-freedoc-blue/90 text-white">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account for the FreeDoc platform.
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
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
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
                      disabled={createUserMutation.isPending}
                    >
                      {createUserMutation.isPending ? "Creating..." : "Create User"}
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
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-3xl font-bold text-freedoc-dark mt-2">{totalUsers}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-freedoc-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Users</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{activeUsers}</p>
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
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingUsers}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Suspended</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{suspendedUsers}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Ban className="h-6 w-6 text-red-600" />
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
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="patient">Patients</SelectItem>
                  <SelectItem value="doctor">Doctors</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">User Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-semibold text-slate-700">User ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">User Details</TableHead>
                    <TableHead className="font-semibold text-slate-700">Role</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Created</TableHead>
                    <TableHead className="font-semibold text-slate-700">Last Login</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="h-8 w-8 animate-spin border-2 border-freedoc-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading users...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-slate-600">No users found.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user: any) => (
                      <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50/50">
                        <TableCell className="font-mono text-sm">{user.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{(user.firstName || '') + ' ' + (user.lastName || '')}</p>
                            <p className="text-sm text-slate-600">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role || 'patient'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(getUserStatus(user), user?.isEmailVerified || false)}>
                            {getUserStatus(user) === "pending" ? "Email Pending" : 
                             (getUserStatus(user) || 'active').charAt(0).toUpperCase() + (getUserStatus(user) || 'active').slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
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
                              <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Details
                              </DropdownMenuItem>
                              {getUserStatus(user) === "active" ? (
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => updateUserMutation.mutate({ userId: user.id, data: { status: "suspended" } })}
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : getUserStatus(user) === "suspended" ? (
                                <DropdownMenuItem 
                                  className="text-green-600"
                                  onClick={() => updateUserMutation.mutate({ userId: user.id, data: { status: "active" } })}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activate User
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => deleteUserMutation.mutate(user.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
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

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user account information.
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
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
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
                      setEditingUser(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-freedoc-blue hover:bg-freedoc-blue/90"
                    disabled={updateUserMutation.isPending}
                  >
                    {updateUserMutation.isPending ? "Updating..." : "Update User"}
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