import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Save,
  CheckCircle,
  Stethoscope,
  ClipboardList,
  Activity,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface RequestDetailsProps {
  params: { id: string };
}

export default function DoctorRequestDetails({ params }: RequestDetailsProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const requestId = params.id;

  const [notes, setNotes] = useState("");
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [certificateForm, setCertificateForm] = useState({
    type: "",
    dateFrom: "",
    dateTo: "",
    condition: "",
    restrictions: "",
  });
  const [prescriptionForm, setPrescriptionForm] = useState({
    medication: "",
    dosage: "",
    quantity: "",
    repeats: 0,
    instructions: "",
  });

  // Fetch request details
  const { data: request, isLoading } = useQuery({
    queryKey: [`/api/doctor/requests/${requestId}`],
    enabled: !!requestId,
  });

  // Set initial notes when request loads
  useEffect(() => {
    if (request && (request as any).doctorNotes) {
      setNotes((request as any).doctorNotes);
    }
  }, [request]);

  // Update notes mutation
  const updateNotesMutation = useMutation({
    mutationFn: async (newNotes: string) => {
      const response = await fetch(`/api/doctor/requests/${requestId}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: newNotes })
      });
      if (!response.ok) throw new Error('Failed to update notes');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Notes Saved",
        description: "Your notes have been saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/doctor/requests/${requestId}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save notes",
        variant: "destructive",
      });
    },
  });

  // Complete request mutation
  const completeRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/doctor/requests/${requestId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to complete request');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Completed",
        description: "The request has been completed successfully",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/doctor/requests/${requestId}`] });
      setLocation("/doctor-dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete request",
        variant: "destructive",
      });
    },
  });

  const handleSaveNotes = () => {
    updateNotesMutation.mutate(notes);
  };

  // Document generation mutation
  const generateDocumentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/documents/generate-${data.type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultationId: requestId,
          [`${data.type}Data`]: data.data
        })
      });
      if (!response.ok) throw new Error('Failed to generate document');
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Document Generated",
        description: "The document has been generated and is ready for download.",
      });
      // Open the generated document in a new tab
      if (result.htmlContent) {
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(result.htmlContent);
          newWindow.document.close();
        }
      }
      // Mark request as completed
      completeRequestMutation.mutate({ status: "completed" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate document",
        variant: "destructive",
      });
    },
  });

  const handleGenerateCertificate = () => {
    // Get patient info from request data
    const patientName = `${(request as any)?.patientData?.firstName || 'Patient'} ${(request as any)?.patientData?.lastName || ''}`.trim();
    const patientDOB = (request as any)?.patientData?.dateOfBirth || '1990-01-01';
    const requestData = (request as any)?.requestData || {};

    const certificateData = {
      patientName,
      patientDOB,
      patientAddress: (request as any)?.patientData?.address || '',
      certificateType: certificateForm.type,
      dateFrom: certificateForm.dateFrom,
      dateTo: certificateForm.dateTo,
      condition: certificateForm.condition,
      workCapacity: certificateForm.restrictions ? `Limited: ${certificateForm.restrictions}` : 'Normal capacity',
      additionalNotes: certificateForm.restrictions,
    };
    
    generateDocumentMutation.mutate({
      type: 'certificate',
      data: certificateData
    });
    setShowCertificateDialog(false);
  };

  const handleGeneratePrescription = () => {
    // Get patient info from request data
    const patientName = `${(request as any)?.patientData?.firstName || 'Patient'} ${(request as any)?.patientData?.lastName || ''}`.trim();
    const patientDOB = (request as any)?.patientData?.dateOfBirth || '1990-01-01';
    const requestData = (request as any)?.requestData || {};

    const prescriptionData = {
      patientName,
      patientDOB,
      patientAddress: (request as any)?.patientData?.address || '',
      medications: [{
        name: prescriptionForm.medication || requestData.medication || 'Medication',
        dosage: prescriptionForm.dosage || requestData.dosage || '10mg',
        frequency: 'Once daily',
        quantity: prescriptionForm.quantity || '30',
        repeats: prescriptionForm.repeats || 0
      }],
      diagnosis: requestData.reason || 'As prescribed',
      additionalInstructions: prescriptionForm.instructions,
    };
    
    generateDocumentMutation.mutate({
      type: 'prescription',
      data: prescriptionData
    });
    setShowPrescriptionDialog(false);
  };

  // Add pathology generation handler
  const handleGeneratePathology = () => {
    const patientName = `${(request as any)?.patientData?.firstName || 'Patient'} ${(request as any)?.patientData?.lastName || ''}`.trim();
    const patientDOB = (request as any)?.patientData?.dateOfBirth || '1990-01-01';
    const requestData = (request as any)?.requestData || {};

    const pathologyData = {
      patientName,
      patientDOB,
      patientAddress: (request as any)?.patientData?.address || '',
      testsRequested: [requestData.test_type || 'Blood work'],
      clinicalDetails: requestData.reason_for_test || 'Clinical assessment required',
      urgency: 'routine' as const,
      preferredLab: requestData.preferred_lab || '',
      additionalNotes: requestData.previous_tests || '',
    };
    
    generateDocumentMutation.mutate({
      type: 'pathology',
      data: pathologyData
    });
  };

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
          <Button onClick={() => setLocation("/doctor-dashboard")}>
            Return to Dashboard
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
              onClick={() => setLocation("/doctor-dashboard")}
              className="text-slate-600 hover:text-freedoc-blue"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                {getServiceIcon((request as any)?.serviceType || "default")}
                Request Details
              </h1>
              <p className="text-slate-600 mt-1">Manage patient consultation request</p>
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
                    <p className="capitalize mt-1">{(request as any)?.serviceType?.replace('_', ' ') || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Patient ID</Label>
                    <p className="font-mono text-sm mt-1">{(request as any)?.patientId || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Submitted</Label>
                    <p className="mt-1">{(request as any)?.createdAt ? new Date((request as any).createdAt).toLocaleString() : "N/A"}</p>
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
                    <div key={key}>
                      <Label className="text-sm font-medium text-slate-600 capitalize">
                        {key.replace(/_/g, ' ')}
                      </Label>
                      <p className="mt-1 text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Doctor Notes */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Doctor Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add your clinical notes, observations, and treatment recommendations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button 
                  onClick={handleSaveNotes}
                  disabled={updateNotesMutation.isPending}
                  className="bg-freedoc-blue hover:bg-freedoc-blue/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateNotesMutation.isPending ? "Saving..." : "Save Notes"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Actions Panel */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(request as any)?.serviceType === "medical_certificate" && (
                  <Button 
                    onClick={() => setShowCertificateDialog(true)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Generate Certificate
                  </Button>
                )}
                
                {(request as any)?.serviceType === "prescription" && (
                  <Button 
                    onClick={() => setShowPrescriptionDialog(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Prescription
                  </Button>
                )}

                {(request as any)?.serviceType === "pathology" && (
                  <Button 
                    onClick={handleGeneratePathology}
                    disabled={generateDocumentMutation.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    {generateDocumentMutation.isPending ? "Generating..." : "Generate Pathology Referral"}
                  </Button>
                )}

                <Button 
                  onClick={() => completeRequestMutation.mutate({ status: "completed" })}
                  disabled={completeRequestMutation.isPending}
                  className="w-full bg-freedoc-blue hover:bg-freedoc-blue/90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {completeRequestMutation.isPending ? "Completing..." : "Complete Request"}
                </Button>
              </CardContent>
            </Card>

            {/* Patient Timeline */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Request Submitted</p>
                      <p className="text-xs text-slate-600">{(request as any)?.createdAt ? new Date((request as any).createdAt).toLocaleString() : "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Assigned to Doctor</p>
                      <p className="text-xs text-slate-600">{(request as any)?.updatedAt ? new Date((request as any).updatedAt).toLocaleString() : "N/A"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Certificate Generation Dialog */}
        <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Generate Medical Certificate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Certificate Type</Label>
                <Select 
                  value={certificateForm.type} 
                  onValueChange={(value) => setCertificateForm({...certificateForm, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select certificate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sick_leave">Sick Leave</SelectItem>
                    <SelectItem value="fitness_to_work">Fitness to Work</SelectItem>
                    <SelectItem value="study_exemption">Study Exemption</SelectItem>
                    <SelectItem value="general_medical">General Medical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date From</Label>
                  <Input 
                    type="date" 
                    value={certificateForm.dateFrom}
                    onChange={(e) => setCertificateForm({...certificateForm, dateFrom: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Date To</Label>
                  <Input 
                    type="date" 
                    value={certificateForm.dateTo}
                    onChange={(e) => setCertificateForm({...certificateForm, dateTo: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Medical Condition</Label>
                <Input 
                  value={certificateForm.condition}
                  onChange={(e) => setCertificateForm({...certificateForm, condition: e.target.value})}
                  placeholder="Enter medical condition"
                />
              </div>
              <div>
                <Label>Restrictions (Optional)</Label>
                <Textarea 
                  value={certificateForm.restrictions}
                  onChange={(e) => setCertificateForm({...certificateForm, restrictions: e.target.value})}
                  placeholder="Any work or activity restrictions"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCertificateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateCertificate}
                disabled={!certificateForm.type || !certificateForm.dateFrom || !certificateForm.dateTo || !certificateForm.condition}
                className="bg-green-600 hover:bg-green-700"
              >
                Generate Certificate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Prescription Generation Dialog */}
        <Dialog open={showPrescriptionDialog} onOpenChange={setShowPrescriptionDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Generate Prescription</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Medication Name</Label>
                <Input 
                  value={prescriptionForm.medication}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, medication: e.target.value})}
                  placeholder="Enter medication name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Dosage</Label>
                  <Input 
                    value={prescriptionForm.dosage}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})}
                    placeholder="e.g., 500mg"
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input 
                    value={prescriptionForm.quantity}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, quantity: e.target.value})}
                    placeholder="e.g., 30 tablets"
                  />
                </div>
              </div>
              <div>
                <Label>Repeats</Label>
                <Input 
                  type="number"
                  value={prescriptionForm.repeats}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, repeats: Number(e.target.value)})}
                  min="0"
                  max="5"
                />
              </div>
              <div>
                <Label>Instructions</Label>
                <Textarea 
                  value={prescriptionForm.instructions}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, instructions: e.target.value})}
                  placeholder="Dosage instructions and usage guidelines"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPrescriptionDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleGeneratePrescription}
                disabled={!prescriptionForm.medication || !prescriptionForm.dosage || !prescriptionForm.quantity}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Generate Prescription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}