import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Stethoscope,
  ClipboardList,
  Activity,
  MessageSquare,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AdminRequestDetailsProps {
  params: { id: string };
}

export default function AdminRequestDetails({ params }: AdminRequestDetailsProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const requestId = params.id;

  // Fetch request details
  const { data: request, isLoading } = useQuery({
    queryKey: [`/api/admin/requests/${requestId}`],
    enabled: !!requestId,
  });

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case "prescription":
        return <FileText className="h-5 w-5" />;
      case "medical_certificate":
        return <ClipboardList className="h-5 w-5" />;
      case "mental_health":
        return <MessageSquare className="h-5 w-5" />;
      case "telehealth":
        return <Stethoscope className="h-5 w-5" />;
      case "pathology":
        return <Activity className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin border-2 border-freedoc-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-freedoc-dark mb-2">Request Not Found</h2>
          <p className="text-slate-600 mb-4">The requested consultation could not be found.</p>
          <Button onClick={() => setLocation("/admin-requests")}>
            Return to Requests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation("/admin-requests")}
              className="text-slate-600 hover:text-freedoc-blue"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requests
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Eye className="h-7 w-7" />
                Request Details (Admin View)
              </h1>
              <p className="text-slate-600 mt-1">Viewing patient consultation request</p>
            </div>
          </div>
          <Badge className={getStatusColor((request as any)?.status || "pending")}>
            {((request as any)?.status || "pending").charAt(0).toUpperCase() + ((request as any)?.status || "pending").slice(1)}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Request Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Summary */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Request Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Request ID</Label>
                    <p className="font-mono text-sm mt-1">{(request as any)?.id || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Service Type</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {getServiceIcon((request as any)?.serviceType || "default")}
                      <p className="capitalize">{(request as any)?.serviceType?.replace('_', ' ') || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Patient ID</Label>
                    <p className="font-mono text-sm mt-1">{(request as any)?.patientId || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Assigned Doctor</Label>
                    <p className="mt-1">{(request as any)?.doctorId || "Unassigned"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Submitted</Label>
                    <p className="mt-1">{(request as any)?.createdAt ? new Date((request as any).createdAt).toLocaleString() : "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Last Updated</Label>
                    <p className="mt-1">{(request as any)?.updatedAt ? new Date((request as any).updatedAt).toLocaleString() : "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Details */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Patient Request Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(request as any)?.requestData && Object.entries((request as any).requestData).map(([key, value]: [string, any]) => (
                    <div key={key} className="bg-slate-50 p-3 rounded-lg">
                      <Label className="text-sm font-medium text-slate-700 capitalize">
                        {key.replace(/_/g, ' ')}
                      </Label>
                      <p className="mt-1 text-sm text-slate-800">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Doctor Notes (if any) */}
            {(request as any)?.doctorNotes && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Doctor Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-800">{(request as any).doctorNotes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Admin Actions Panel */}
          <div className="space-y-6">
            {/* Admin Notice */}
            <Card className="border-amber-200 bg-amber-50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-800">Admin View</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      You are viewing this request as an administrator. Only the assigned doctor can edit notes and complete this request.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Timeline */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Request Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Request Submitted</p>
                      <p className="text-xs text-slate-600">
                        {(request as any)?.createdAt ? new Date((request as any).createdAt).toLocaleString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  {(request as any)?.doctorId && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Assigned to Doctor</p>
                        <p className="text-xs text-slate-600">
                          Dr. {(request as any).doctorId}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {(request as any)?.status === "completed" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Request Completed</p>
                        <p className="text-xs text-slate-600">
                          {(request as any)?.updatedAt ? new Date((request as any).updatedAt).toLocaleString() : "N/A"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Management Actions */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation("/admin-requests")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to All Requests
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Feature Coming Soon",
                      description: "Request reassignment will be available soon",
                    });
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Reassign Doctor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}