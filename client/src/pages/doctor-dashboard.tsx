import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Users,
  Timer,
  LogOut,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

type Consultation = {
  id: string;
  patientId: string;
  serviceType: string;
  status: string;
  requestData: any;
  createdAt: string;
  doctorNotes?: string;
};

export default function DoctorDashboard() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated or not a doctor
  useEffect(() => {
    if (!isLoading && (!user || (user as any).role !== "doctor")) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/doctor-login";
      }, 500);
      return;
    }
  }, [user, isLoading, toast]);

  const { data: pendingConsultations = [], isLoading: consultationsLoading } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations/pending"],
    retry: false,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      consultationId,
      status,
      doctorNotes,
    }: {
      consultationId: string;
      status: string;
      doctorNotes?: string;
    }) => {
      const response = await apiRequest("PATCH", `/api/consultations/${consultationId}/status`, {
        status,
        doctorNotes,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Consultation status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations/pending"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (consultationId: string, status: string, doctorNotes?: string) => {
    updateStatusMutation.mutate({ consultationId, status, doctorNotes });
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case "prescription":
        return "💊";
      case "medical_certificate":
        return "📄";
      case "telehealth":
        return "📹";
      case "mental_health":
        return "❤️";
      case "pathology":
        return "🔬";
      default:
        return "📋";
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-freedoc-blue text-white p-4 rounded-lg w-fit mx-auto mb-4">
            <div className="h-8 w-8 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          <p className="text-freedoc-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-freedoc-dark">Doctor Dashboard</h1>
              <p className="text-freedoc-secondary">
                Dr.{" "}
                <span className="font-medium" data-testid="text-doctor-name">
                  {user.firstName} {user.lastName}
                </span>{" "}
                - General Practitioner
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">Online</Badge>
              <Button
                variant="ghost"
                onClick={() => (window.location.href = "/api/logout")}
                className="text-freedoc-secondary hover:text-freedoc-blue"
                data-testid="button-logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-freedoc-secondary text-sm">Pending Consultations</p>
                  <p className="text-2xl font-bold text-freedoc-dark" data-testid="text-pending-count">
                    {pendingConsultations.length}
                  </p>
                </div>
                <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-freedoc-secondary text-sm">Completed Today</p>
                  <p className="text-2xl font-bold text-freedoc-dark">0</p>
                </div>
                <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-freedoc-secondary text-sm">Total Patients</p>
                  <p className="text-2xl font-bold text-freedoc-dark">0</p>
                </div>
                <div className="bg-blue-100 text-freedoc-blue p-2 rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-freedoc-secondary text-sm">Avg Response Time</p>
                  <p className="text-2xl font-bold text-freedoc-dark">-</p>
                </div>
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                  <Timer className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consultation Queue */}
        <Card className="shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-freedoc-dark">Consultation Queue</h2>
          </div>
          <CardContent className="p-6">
            {consultationsLoading ? (
              <div className="text-center py-8">
                <div className="h-8 w-8 animate-spin border-2 border-freedoc-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-freedoc-secondary">Loading consultations...</p>
              </div>
            ) : pendingConsultations.length === 0 ? (
              <div className="text-center text-freedoc-secondary py-8">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending consultations at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingConsultations.map((consultation) => (
                  <ConsultationCard
                    key={consultation.id}
                    consultation={consultation}
                    onStatusUpdate={handleStatusUpdate}
                    isUpdating={updateStatusMutation.isPending}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ConsultationCard({
  consultation,
  onStatusUpdate,
  isUpdating,
}: {
  consultation: Consultation;
  onStatusUpdate: (id: string, status: string, notes?: string) => void;
  isUpdating: boolean;
}) {
  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case "prescription":
        return "💊";
      case "medical_certificate":
        return "📄";
      case "telehealth":
        return "📹";
      case "mental_health":
        return "❤️";
      case "pathology":
        return "🔬";
      default:
        return "📋";
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4" data-testid={`consultation-card-${consultation.id}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getServiceIcon(consultation.serviceType)}</div>
          <div>
            <h4 className="font-semibold text-freedoc-dark">
              {consultation.serviceType.replace("_", " ").toUpperCase()} Request
            </h4>
            <p className="text-sm text-freedoc-secondary">
              Submitted: {new Date(consultation.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusUpdate(consultation.id, "in_progress")}
            disabled={isUpdating}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
            data-testid={`button-in-progress-${consultation.id}`}
          >
            In Progress
          </Button>
          <Button
            size="sm"
            onClick={() => onStatusUpdate(consultation.id, "completed")}
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700 text-white"
            data-testid={`button-complete-${consultation.id}`}
          >
            Complete
          </Button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-freedoc-dark">
        <h5 className="font-medium">Request Details:</h5>
        {Object.entries(consultation.requestData)
          .filter(([key, value]) => key !== "service_type" && value)
          .map(([key, value]) => (
            <div key={key} className="flex">
              <strong className="capitalize w-32 flex-shrink-0">
                {key.replace("_", " ")}:
              </strong>
              <span className="flex-1">{value as string}</span>
            </div>
          ))}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-freedoc-dark mb-2">
          Doctor Notes (Optional)
        </label>
        <Textarea
          placeholder="Add notes for the patient..."
          className="w-full"
          id={`notes-${consultation.id}`}
          data-testid={`textarea-notes-${consultation.id}`}
        />
      </div>
    </div>
  );
}
