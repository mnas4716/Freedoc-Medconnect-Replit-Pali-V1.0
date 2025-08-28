import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  EyeOff,
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'suspended' | 'pending';
};

// Form schemas
const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

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

  // Check admin session
  const { data: sessionUser } = useQuery({
    queryKey: ['/api/auth/session-user'],
    retry: false,
  });

  // Fetch users from API
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: !isLoading && ((user as any)?.role === "admin" || !!sessionUser),
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

  // Update user status mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string, status: string }) => {
      return apiRequest(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    },
    onSuccess: () => {
      toast({
        title: "Success", 
        description: "User status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3" />;
      case "suspended":
        return <Ban className="h-3 w-3" />;
      case "pending":
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
          <p className="text-slate-600">Loading user management...</p>
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
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-freedoc-dark">User Management</h1>
                  <p className="text-sm text-slate-600">Manage patient accounts and profiles</p>
                </div>
              </div>
            </div>
            <Button className="bg-freedoc-blue hover:bg-freedoc-blue/90 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New User
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
                  <p className="text-slate-600 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-freedoc-dark mt-1">{totalUsers}</p>
                </div>
                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Active Users</p>
                  <p className="text-2xl font-bold text-freedoc-dark mt-1">{activeUsers}</p>
                </div>
                <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Suspended</p>
                  <p className="text-2xl font-bold text-freedoc-dark mt-1">{suspendedUsers}</p>
                </div>
                <div className="bg-red-100 text-red-600 p-3 rounded-xl">
                  <Ban className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Pending Verification</p>
                  <p className="text-2xl font-bold text-freedoc-dark mt-1">{pendingUsers}</p>
                </div>
                <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50 mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle className="text-xl font-bold text-freedoc-dark">User Directory</CardTitle>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="patient">Patients</SelectItem>
                    <SelectItem value="doctor">Doctors</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
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
                    <TableHead className="font-semibold text-slate-700">User</TableHead>
                    <TableHead className="font-semibold text-slate-700">Email</TableHead>
                    <TableHead className="font-semibold text-slate-700">Password</TableHead>
                    <TableHead className="font-semibold text-slate-700">Role</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Created</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-br from-freedoc-blue to-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-freedoc-dark">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-slate-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="text-sm">{user.email}</span>
                          {user.isEmailVerified && (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono">
                            {showPasswords[user.id] ? user.password : '••••••••'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => togglePasswordVisibility(user.id)}
                            data-testid={`button-toggle-password-${user.id}`}
                          >
                            {showPasswords[user.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(user.status)} flex items-center space-x-1 w-fit`}>
                          {getStatusIcon(user.status)}
                          <span className="capitalize">{user.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString()}
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
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center space-x-2"
                              onClick={() => {
                                setEditingUser(user);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit User</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center space-x-2 text-orange-600">
                              <Ban className="h-4 w-4" />
                              <span>Suspend User</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center space-x-2 text-red-600">
                              <Trash2 className="h-4 w-4" />
                              <span>Delete User</span>
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

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and credentials
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <EditUserForm
                user={editingUser}
                onClose={() => {
                  setIsEditDialogOpen(false);
                  setEditingUser(null);
                }}
                onSuccess={() => {
                  toast({
                    title: "Success",
                    description: "User updated successfully",
                  });
                  queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
                  setIsEditDialogOpen(false);
                  setEditingUser(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Edit User Form Component
function EditUserForm({ user, onClose, onSuccess }: { user: any, onClose: () => void, onSuccess: () => void }) {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: user.password || '',
      phoneNumber: user.phoneNumber || '',
      dateOfBirth: user.dateOfBirth || '',
      medicareNumber: user.medicareNumber || '',
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateUserMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Password" 
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateUserMutation.isPending}>
            {updateUserMutation.isPending ? "Updating..." : "Update User"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}