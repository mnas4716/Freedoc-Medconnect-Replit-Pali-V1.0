import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Register from "@/pages/register";
import OTPVerification from "@/pages/otp-verification";
import PatientDashboard from "@/pages/patient-dashboard";
import DoctorDashboard from "@/pages/doctor-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import HowItWorks from "@/pages/how-it-works";
import Prescription from "@/pages/prescription";
import MedicalCertificate from "@/pages/medical-certificate";
import MentalHealth from "@/pages/mental-health";
import Telehealth from "@/pages/telehealth";
import Pathology from "@/pages/pathology";
import DoctorLogin from "@/pages/doctor-login";
import AdminLogin from "@/pages/admin-login";
import UserManagement from "@/pages/user-management-new";
import DoctorManagement from "@/pages/doctor-management-new";
import SystemAnalytics from "@/pages/system-analytics";
import AdminRequests from "@/pages/admin-requests";
import AdminRequestDetails from "@/pages/admin-request-details";
import DoctorRequestDetails from "@/pages/doctor-request-details";
import NotFound from "@/pages/not-found";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";

function Router() {
  // For now, disable auth check in development to show landing page
  // TODO: Enable auth when Replit Auth is properly configured
  const authDisabled = true;
  
  if (authDisabled) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/register" component={Register} />
        <Route path="/verify-otp" component={OTPVerification} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/prescription" component={Prescription} />
        <Route path="/prescriptions" component={Prescription} />
        <Route path="/medical-certificate" component={MedicalCertificate} />
        <Route path="/medical-certificates" component={MedicalCertificate} />
        <Route path="/mental-health" component={MentalHealth} />
        <Route path="/telehealth" component={Telehealth} />
        <Route path="/pathology" component={Pathology} />
        <Route path="/doctor-login" component={DoctorLogin} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/doctor-dashboard" component={DoctorDashboard} />
        <Route path="/admin-dashboard" component={AdminDashboard} />
        <Route path="/dashboard" component={PatientDashboard} />
        <Route path="/user-management" component={UserManagement} />
        <Route path="/doctor-management" component={DoctorManagement} />
        <Route path="/admin-requests" component={AdminRequests} />
        <Route path="/admin/request/:id" component={AdminRequestDetails} />
        <Route path="/doctor/request/:id" component={DoctorRequestDetails} />
        <Route path="/system-analytics" component={SystemAnalytics} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  const { isAuthenticated, isLoading, user, isUnauthorized } = useAuth();

  // If we get an unauthorized error, treat it as not authenticated instead of loading
  if (isLoading && !isUnauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-freedoc-blue text-white p-4 rounded-lg w-fit mx-auto mb-4">
            <div className="h-8 w-8 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          <p className="text-freedoc-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/register" component={Register} />
          <Route path="/verify-otp" component={OTPVerification} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/prescription" component={Prescription} />
          <Route path="/medical-certificate" component={MedicalCertificate} />
          <Route path="/mental-health" component={MentalHealth} />
          <Route path="/telehealth" component={Telehealth} />
          <Route path="/pathology" component={Pathology} />
          <Route path="/doctor-login" component={DoctorLogin} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/doctor-dashboard" component={DoctorDashboard} />
          <Route path="/admin-dashboard" component={AdminDashboard} />
        </>
      ) : (
        <>
          {user?.role === "patient" && (
            <>
              <Route path="/" component={PatientDashboard} />
              <Route path="/dashboard" component={PatientDashboard} />
            </>
          )}
          {user?.role === "doctor" && (
            <>
              <Route path="/" component={DoctorDashboard} />
              <Route path="/dashboard" component={DoctorDashboard} />
              <Route path="/doctor-dashboard" component={DoctorDashboard} />
            </>
          )}
          {user?.role === "admin" && (
            <>
              <Route path="/" component={AdminDashboard} />
              <Route path="/dashboard" component={AdminDashboard} />
              <Route path="/admin-dashboard" component={AdminDashboard} />
            </>
          )}
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/prescription" component={Prescription} />
          <Route path="/medical-certificate" component={MedicalCertificate} />
          <Route path="/mental-health" component={MentalHealth} />
          <Route path="/telehealth" component={Telehealth} />
          <Route path="/pathology" component={Pathology} />
          <Route path="/doctor-login" component={DoctorLogin} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/doctor-dashboard" component={DoctorDashboard} />
          <Route path="/admin-dashboard" component={AdminDashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
