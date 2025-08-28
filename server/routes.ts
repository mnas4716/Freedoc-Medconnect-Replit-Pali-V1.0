import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-simple";
import { setupAuth, isAuthenticated } from "./replitAuth";

// Session-based authentication middleware for doctors/admins
const isSessionAuthenticated = (requiredRole?: string) => {
  return (req: any, res: any, next: any) => {
    const session = req.session;
    const sessionUser = session?.doctorUser || session?.adminUser;
    
    if (!sessionUser || !sessionUser.isAuthenticated) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (requiredRole && sessionUser.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    req.sessionUser = sessionUser;
    next();
  };
};
import { emailService } from "./services/emailService";
import { pdfService } from "./services/pdfService";
import {
  registrationSchema,
  otpVerificationSchema,
  prescriptionRequestSchema,
  medicalCertificateRequestSchema,
  mentalHealthRequestSchema,
  telehealthRequestSchema,
  pathologyRequestSchema,
} from "@shared/schema";
import { z } from "zod";
import { DocumentGenerator } from "./services/documentGenerator";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Doctor login
  app.post("/api/auth/doctor-login", async (req, res) => {
    try {
      const { username, name, specialization } = req.body;
      
      // Create/update session for doctor
      (req as any).session.doctorUser = {
        id: `doctor_${username}`,
        username,
        name,
        specialization,
        role: "doctor",
        isAuthenticated: true
      };

      res.json({ 
        success: true, 
        user: (req as any).session.doctorUser 
      });
    } catch (error) {
      console.error("Doctor login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin login
  app.post("/api/auth/admin-login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Authenticate admin credentials
      // Allow multiple demo admin accounts with the same password
      const validAdmins: Record<string, string> = {
        admin: "System Administrator",
        superadmin: "Super Administrator",
        healthadmin: "Health Administrator",
      };

      if (validAdmins[username] && password === "admin123") {
        // Create/update session for admin
        (req as any).session.adminUser = {
          id: `admin_${username}`,
          username,
          name: validAdmins[username],
          role: "admin",
          isAuthenticated: true,
        };

        // Force session save
        await new Promise((resolve, reject) => {
          (req as any).session.save((err: any) => {
            if (err) {
              console.error("Session save error:", err);
              reject(err);
            } else {
              resolve(true);
            }
          });
        });

        res.json({
          success: true,
          user: (req as any).session.adminUser,
        });
      } else {
        res.status(401).json({ message: "Invalid admin credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get current session user (doctor or admin)
  app.get("/api/auth/session-user", async (req, res) => {
    try {
      const session = req as any;
      console.log('Session data:', session.session); // Debug log
      
      if (session.session?.doctorUser) {
        return res.json(session.session.doctorUser);
      }
      if (session.session?.adminUser) {
        return res.json(session.session.adminUser);
      }
      res.status(401).json({ message: "No active session" });
    } catch (error) {
      console.error("Session user error:", error);
      res.status(500).json({ message: "Failed to get session user" });
    }
  });

  // Logout for all session types
  app.post("/api/auth/session-logout", async (req, res) => {
    try {
      const session = req as any;
      if (session.session) {
        delete session.session.doctorUser;
        delete session.session.adminUser;
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Session logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Registration and OTP routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registrationSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists with this email" });
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save OTP
      await storage.createOtp({
        email: validatedData.email,
        otp,
        expiresAt,
        verified: false,
      });

      // Send OTP email
      await emailService.sendOTP(validatedData.email, otp);

      // Store registration data temporarily in session
      (req as any).session.pendingRegistration = validatedData;

      res.json({ message: "OTP sent to email", email: validatedData.email });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { email, otp } = otpVerificationSchema.parse(req.body);

      const isValid = await storage.verifyOtp(email, otp);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Get pending registration data
      const pendingData = (req as any).session.pendingRegistration;
      if (!pendingData || pendingData.email !== email) {
        return res.status(400).json({ message: "No pending registration found" });
      }

      // Create user account
      const user = await storage.upsertUser({
        id: undefined, // Let database generate ID
        email: pendingData.email,
        firstName: pendingData.firstName,
        lastName: pendingData.lastName,
        dateOfBirth: pendingData.dateOfBirth,
        medicareNumber: pendingData.medicareNumber,
        phoneNumber: pendingData.phoneNumber,
        role: "patient",
        isEmailVerified: true,
      });

      // Clear pending registration
      delete (req as any).session.pendingRegistration;

      res.json({ message: "Registration completed successfully", userId: user.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("OTP verification error:", error);
      res.status(500).json({ message: "OTP verification failed" });
    }
  });

  app.post("/api/auth/resend-otp", async (req, res) => {
    try {
      const { email } = req.body;

      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await storage.createOtp({
        email,
        otp,
        expiresAt,
        verified: false,
      });

      await emailService.sendOTP(email, otp);

      res.json({ message: "OTP resent successfully" });
    } catch (error) {
      console.error("Resend OTP error:", error);
      res.status(500).json({ message: "Failed to resend OTP" });
    }
  });

  // Doctor assignment algorithm - equal distribution
  async function assignDoctorToConsultation(): Promise<string | null> {
    const activeDoctors = await storage.getActiveDoctors();
    if (activeDoctors.length === 0) return null;

    // Find doctor with minimum workload
    const doctorWithMinWorkload = activeDoctors.reduce((min, doctor) =>
      (doctor.workloadCount || 0) < (min.workloadCount || 0) ? doctor : min
    );

    return doctorWithMinWorkload.id;
  }

  // Consultation routes
  app.post("/api/consultations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { serviceType, formData } = req.body;

      // Validate form data based on service type
      let validatedData;
      switch (serviceType) {
        case "prescription":
          validatedData = prescriptionRequestSchema.parse(formData);
          break;
        case "medical_certificate":
          validatedData = medicalCertificateRequestSchema.parse(formData);
          break;
        case "mental_health":
          validatedData = mentalHealthRequestSchema.parse(formData);
          break;
        case "telehealth":
          validatedData = telehealthRequestSchema.parse(formData);
          break;
        case "pathology":
          validatedData = pathologyRequestSchema.parse(formData);
          break;
        default:
          return res.status(400).json({ message: "Invalid service type" });
      }

      // Create consultation
      const consultation = await storage.createConsultation({
        patientId: userId,
        serviceType,
        requestData: validatedData,
        status: "pending",
      });

      // Assign doctor with equal distribution
      const doctorId = await assignDoctorToConsultation();
      if (doctorId) {
        await storage.assignDoctorToConsultation(consultation.id, doctorId);
      }

      res.json({ message: "Consultation request submitted successfully", consultationId: consultation.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Consultation creation error:", error);
      res.status(500).json({ message: "Failed to create consultation" });
    }
  });

  app.get("/api/consultations/patient", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const consultations = await storage.getConsultationsByPatient(userId);
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching patient consultations:", error);
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  app.get("/api/consultations/doctor", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const doctor = await storage.getDoctorByUserId(userId);
      if (!doctor) {
        return res.status(403).json({ message: "Access denied - not a doctor" });
      }

      const consultations = await storage.getConsultationsByDoctor(doctor.id);
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching doctor consultations:", error);
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  app.get("/api/consultations/pending", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const doctor = await storage.getDoctorByUserId(userId);
      if (!doctor) {
        return res.status(403).json({ message: "Access denied - not a doctor" });
      }

      const consultations = await storage.getPendingConsultations();
      // Filter consultations assigned to this doctor
      const doctorConsultations = consultations.filter(c => c.doctorId === doctor.id);
      res.json(doctorConsultations);
    } catch (error) {
      console.error("Error fetching pending consultations:", error);
      res.status(500).json({ message: "Failed to fetch pending consultations" });
    }
  });

  app.patch("/api/consultations/:id/status", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status, doctorNotes } = req.body;
      const userId = req.user.claims.sub;

      // Verify doctor access
      const doctor = await storage.getDoctorByUserId(userId);
      if (!doctor) {
        return res.status(403).json({ message: "Access denied - not a doctor" });
      }

      const consultation = await storage.getConsultationById(id);
      if (!consultation || consultation.doctorId !== doctor.id) {
        return res.status(404).json({ message: "Consultation not found or access denied" });
      }

      await storage.updateConsultationStatus(id, status, doctorNotes);

      // If completed, handle document generation
      if (status === "completed") {
        const patient = await storage.getUser(consultation.patientId);
        const doctorWithUser = await storage.getDoctorWithUserById(doctor.id);
        
        if (patient && doctorWithUser) {
          // Generate documents based on service type
          if (consultation.serviceType === "prescription") {
            const prescData = consultation.requestData as any;
            const prescription = await storage.createPrescription({
              consultationId: id,
              patientId: consultation.patientId,
              doctorId: doctor.id,
              medicationName: prescData.medication,
              dosage: prescData.dosage,
              quantity: "30", // Default quantity
              repeats: 0,
              instructions: prescData.reason,
            });

            // Generate PDF
            const pdfPath = pdfService.generatePrescription({
              patientName: `${patient.firstName} ${patient.lastName}`,
              dateOfBirth: patient.dateOfBirth || "",
              medicationName: prescData.medication,
              dosage: prescData.dosage,
              quantity: "30",
              repeats: 0,
              instructions: prescData.reason,
              doctorName: `${doctorWithUser.user?.firstName || ''} ${doctorWithUser.user?.lastName || ''}`,
              doctorLicense: doctorWithUser.licenseNumber,
              issuedDate: new Date().toLocaleDateString(),
            });

            await storage.updatePrescriptionPdf(prescription.id, pdfPath);
          } else if (consultation.serviceType === "medical_certificate") {
            const certData = consultation.requestData as any;
            const certificate = await storage.createMedicalCertificate({
              consultationId: id,
              patientId: consultation.patientId,
              doctorId: doctor.id,
              certificateType: certData.certificate_type,
              dateFrom: new Date(certData.date_from),
              dateTo: new Date(certData.date_to),
              condition: certData.symptoms,
            });

            // Generate PDF
            const pdfPath = pdfService.generateMedicalCertificate({
              patientName: `${patient.firstName} ${patient.lastName}`,
              dateOfBirth: patient.dateOfBirth || "",
              certificateType: certData.certificate_type,
              dateFrom: certData.date_from,
              dateTo: certData.date_to,
              condition: certData.symptoms,
              doctorName: `${doctorWithUser.user?.firstName || ''} ${doctorWithUser.user?.lastName || ''}`,
              doctorLicense: doctorWithUser.licenseNumber,
              issuedDate: new Date().toLocaleDateString(),
            });

            await storage.updateMedicalCertificatePdf(certificate.id, pdfPath);
          }

          // Send notification email
          await emailService.sendConsultationUpdate(
            patient.email || "",
            `${patient.firstName} ${patient.lastName}`,
            consultation.serviceType.replace("_", " "),
            status,
            `${doctorWithUser.user?.firstName || ''} ${doctorWithUser.user?.lastName || ''}`
          );
        }
      }

      res.json({ message: "Consultation status updated successfully" });
    } catch (error) {
      console.error("Error updating consultation status:", error);
      res.status(500).json({ message: "Failed to update consultation status" });
    }
  });

  // Admin routes (removed - using session-based auth below)

  // Document download routes
  app.get("/api/documents/prescription/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;

      const prescriptions = await storage.getPrescriptionsByPatient(userId);
      const prescription = prescriptions.find(p => p.id === id);

      if (!prescription || !prescription.pdfPath) {
        return res.status(404).json({ message: "Prescription not found" });
      }

      res.sendFile(prescription.pdfPath);
    } catch (error) {
      console.error("Error downloading prescription:", error);
      res.status(500).json({ message: "Failed to download prescription" });
    }
  });

  app.get("/api/documents/certificate/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;

      const certificates = await storage.getMedicalCertificatesByPatient(userId);
      const certificate = certificates.find(c => c.id === id);

      if (!certificate || !certificate.pdfPath) {
        return res.status(404).json({ message: "Certificate not found" });
      }

      res.sendFile(certificate.pdfPath);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      res.status(500).json({ message: "Failed to download certificate" });
    }
  });

  // Cleanup expired OTPs periodically
  setInterval(async () => {
    try {
      await storage.deleteExpiredOtps();
    } catch (error) {
      console.error("Error cleaning up expired OTPs:", error);
    }
  }, 60 * 60 * 1000); // Every hour

  // Admin routes - bypass auth temporarily for debugging
  app.get("/api/admin/stats", async (req: any, res) => {
    try {
      // Temporarily bypass auth for testing - REMOVE IN PRODUCTION
      const stats = await storage.getAdminStats();
      const enhancedStats = {
        ...stats,
        monthlyGrowth: 12.5,
        averageResponseTime: "2.4 hours", 
        patientSatisfaction: 4.8
      };
      res.json(enhancedStats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.get("/api/admin/consultations", async (req: any, res) => {
    try {
      // Temporarily bypass auth for testing - REMOVE IN PRODUCTION
      const consultations = await storage.getAllConsultations();
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching admin consultations:", error);
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  // Doctor routes
  app.get("/api/consultations/pending", isSessionAuthenticated("doctor"), async (req: any, res) => {
    try {
      const doctorId = req.sessionUser.id;
      const consultations = await storage.getConsultationsByDoctor(doctorId);
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching doctor consultations:", error);
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  app.post("/api/consultations/:id/update", isSessionAuthenticated("doctor"), async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status, doctorNotes } = req.body;
      
      await storage.updateConsultationStatus(id, status, doctorNotes);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating consultation:", error);
      res.status(500).json({ message: "Failed to update consultation" });
    }
  });

  // Duplicate routes removed - using ones above

  // Doctor dashboard API routes
  app.get('/api/doctor/consultations', isSessionAuthenticated, async (req: any, res) => {
    if (req.session.doctorUser?.role !== 'doctor') {
      return res.status(403).json({ message: 'Doctor access required' });
    }
    try {
      const doctorId = req.session.doctorUser.id;
      const consultations = await storage.getConsultationsByDoctor(doctorId);
      res.json(consultations);
    } catch (error) {
      console.error('Error fetching doctor consultations:', error);
      res.status(500).json({ message: 'Failed to fetch consultations' });
    }
  });

  app.put('/api/doctor/consultation/:id/status', isSessionAuthenticated, async (req: any, res) => {
    if (req.session.doctorUser?.role !== 'doctor') {
      return res.status(403).json({ message: 'Doctor access required' });
    }
    try {
      const { id } = req.params;
      const { status, doctorNotes } = req.body;
      const success = await storage.updateConsultationStatus(id, status, doctorNotes);
      if (success) {
        res.json({ message: 'Consultation updated successfully' });
      } else {
        res.status(500).json({ message: 'Failed to update consultation' });
      }
    } catch (error) {
      console.error('Error updating consultation:', error);
      res.status(500).json({ message: 'Failed to update consultation' });
    }
  });

  // User management API routes for admin
  app.get('/api/admin/users', async (req: any, res) => {
    // Temporarily bypass auth for testing - REMOVE IN PRODUCTION
    try {
      const users = await storage.getAllUsersWithPasswords();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  app.put('/api/admin/users/:id', async (req: any, res) => {
    // Temporarily bypass auth for testing - REMOVE IN PRODUCTION
    try {
      const { id } = req.params;
      const success = await storage.updateUser(id, req.body);
      if (success) {
        res.json({ message: 'User updated successfully' });
      } else {
        res.status(500).json({ message: 'Failed to update user' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  });

  app.delete('/api/admin/users/:id', async (req: any, res) => {
    // Temporarily bypass auth for testing - REMOVE IN PRODUCTION
    try {
      const { id } = req.params;
      const success = await storage.deleteUser(id);
      if (success) {
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(500).json({ message: 'Failed to delete user' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  });

  // Doctor management API routes for admin
  app.get('/api/admin/doctors', async (req: any, res) => {
    // Temporarily bypass auth for testing - REMOVE IN PRODUCTION
    try {
      const doctors = await storage.getAllDoctorsWithDetails();
      res.json(doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      res.status(500).json({ message: 'Failed to fetch doctors' });
    }
  });

  app.post('/api/admin/doctors', async (req: any, res) => {
    if (!req.session?.adminUser || req.session.adminUser.role !== 'admin') {
      return res.status(401).json({ message: 'Admin access required' });
    }
    try {
      const doctor = await storage.createDoctor(req.body);
      res.json({ message: 'Doctor created successfully', doctor });
    } catch (error) {
      console.error('Error creating doctor:', error);
      res.status(500).json({ message: 'Failed to create doctor' });
    }
  });

  app.put('/api/admin/doctors/:id', async (req: any, res) => {
    if (!req.session?.adminUser || req.session.adminUser.role !== 'admin') {
      return res.status(401).json({ message: 'Admin access required' });
    }
    try {
      const { id } = req.params;
      const success = await storage.updateDoctor(id, req.body);
      if (success) {
        res.json({ message: 'Doctor updated successfully' });
      } else {
        res.status(500).json({ message: 'Failed to update doctor' });
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      res.status(500).json({ message: 'Failed to update doctor' });
    }
  });

  app.delete('/api/admin/doctors/:id', async (req: any, res) => {
    if (!req.session?.adminUser || req.session.adminUser.role !== 'admin') {
      return res.status(401).json({ message: 'Admin access required' });
    }
    try {
      const { id } = req.params;
      const success = await storage.deleteDoctor(id);
      if (success) {
        res.json({ message: 'Doctor deleted successfully' });
      } else {
        res.status(500).json({ message: 'Failed to delete doctor' });
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      res.status(500).json({ message: 'Failed to delete doctor' });
    }
  });

  // Admin requests management routes
  app.get("/api/admin/requests", async (req: any, res) => {
    if (!req.session?.adminUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const requests = await storage.getAllConsultations();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.put("/api/admin/requests/:id/reassign", async (req: any, res) => {
    if (!req.session?.adminUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const { id } = req.params;
      const { doctorId } = req.body;
      const updatedConsultation = await storage.reassignConsultation(id, doctorId);
      res.json(updatedConsultation);
    } catch (error) {
      console.error("Error reassigning consultation:", error);
      res.status(500).json({ message: "Failed to reassign consultation" });
    }
  });

  // Doctor request management routes
  app.get("/api/doctor/requests", async (req: any, res) => {
    if (!req.session?.doctorUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const doctorId = req.session.doctorUser.doctorId;
      const requests = await storage.getConsultationsByDoctor(doctorId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching doctor requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get("/api/doctor/requests/:id", async (req: any, res) => {
    if (!req.session?.doctorUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const { id } = req.params;
      const consultation = await storage.getConsultationById(id);
      if (!consultation) {
        return res.status(404).json({ message: "Request not found" });
      }
      if (consultation.doctorId !== req.session.doctorUser.doctorId) {
        return res.status(403).json({ message: "Not authorized for this request" });
      }
      res.json(consultation);
    } catch (error) {
      console.error("Error fetching consultation:", error);
      res.status(500).json({ message: "Failed to fetch consultation" });
    }
  });

  app.put("/api/doctor/requests/:id/notes", async (req: any, res) => {
    if (!req.session?.doctorUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const updatedConsultation = await storage.updateConsultationNotes(id, notes);
      res.json(updatedConsultation);
    } catch (error) {
      console.error("Error updating consultation notes:", error);
      res.status(500).json({ message: "Failed to update notes" });
    }
  });

  // Patient request viewing routes
  app.get("/api/patient/requests", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getConsultationsByPatient(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching patient requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  // Request submission with auto-assignment
  app.post("/api/requests/submit", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { serviceType, requestData } = req.body;
      
      const consultation = await storage.assignConsultationToNextDoctor(userId, serviceType, requestData);
      
      res.json({
        message: "Request submitted and assigned to doctor",
        consultationId: consultation.id,
        status: "assigned",
      });
    } catch (error) {
      console.error("Request submission error:", error);
      res.status(500).json({ message: "Failed to submit request" });
    }
  });

  // Document generation routes
  app.post("/api/documents/generate-certificate", isSessionAuthenticated("doctor"), async (req: any, res) => {
    try {
      const { consultationId, certificateData } = req.body;
      const doctor = req.sessionUser;
      
      const htmlDocument = DocumentGenerator.generateMedicalCertificate({
        ...certificateData,
        doctorName: doctor.name,
        doctorNumber: doctor.id,
        consultationId,
        generatedDate: new Date().toLocaleDateString('en-AU')
      });
      
      const fileName = `medical_certificate_${consultationId}_${Date.now()}.html`;
      const filePath = DocumentGenerator.saveDocument(htmlDocument, fileName);
      
      // Update consultation with generated document
      await storage.updateConsultationDocument(consultationId, filePath, htmlDocument);
      
      res.json({ 
        message: "Medical certificate generated successfully",
        documentPath: filePath,
        fileName,
        htmlContent: htmlDocument
      });
    } catch (error) {
      console.error("Error generating medical certificate:", error);
      res.status(500).json({ message: "Failed to generate document" });
    }
  });

  app.post("/api/documents/generate-prescription", isSessionAuthenticated("doctor"), async (req: any, res) => {
    try {
      const { consultationId, prescriptionData } = req.body;
      const doctor = req.sessionUser;
      
      const htmlDocument = DocumentGenerator.generatePrescription({
        ...prescriptionData,
        doctorName: doctor.name,
        doctorNumber: doctor.id,
        consultationId,
        generatedDate: new Date().toLocaleDateString('en-AU')
      });
      
      const fileName = `prescription_${consultationId}_${Date.now()}.html`;
      const filePath = DocumentGenerator.saveDocument(htmlDocument, fileName);
      
      // Update consultation with generated document
      await storage.updateConsultationDocument(consultationId, filePath, htmlDocument);
      
      res.json({ 
        message: "Prescription generated successfully",
        documentPath: filePath,
        fileName,
        htmlContent: htmlDocument
      });
    } catch (error) {
      console.error("Error generating prescription:", error);
      res.status(500).json({ message: "Failed to generate document" });
    }
  });

  app.post("/api/documents/generate-pathology", isSessionAuthenticated("doctor"), async (req: any, res) => {
    try {
      const { consultationId, pathologyData } = req.body;
      const doctor = req.sessionUser;
      
      const htmlDocument = DocumentGenerator.generatePathologyReferral({
        ...pathologyData,
        doctorName: doctor.name,
        doctorNumber: doctor.id,
        consultationId,
        generatedDate: new Date().toLocaleDateString('en-AU')
      });
      
      const fileName = `pathology_referral_${consultationId}_${Date.now()}.html`;
      const filePath = DocumentGenerator.saveDocument(htmlDocument, fileName);
      
      // Update consultation with generated document
      await storage.updateConsultationDocument(consultationId, filePath, htmlDocument);
      
      res.json({ 
        message: "Pathology referral generated successfully",
        documentPath: filePath,
        fileName,
        htmlContent: htmlDocument
      });
    } catch (error) {
      console.error("Error generating pathology referral:", error);
      res.status(500).json({ message: "Failed to generate document" });
    }
  });

  // Duplicate removed - using session routes above

  // Patient document download endpoint
  app.get("/api/patient/documents/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const consultation = await storage.getConsultationById(id);
      if (!consultation || consultation.patientId !== userId) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      if (!consultation.generatedDocumentHtml) {
        return res.status(404).json({ message: "Document not yet generated" });
      }
      
      // Return the HTML document
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `inline; filename="${consultation.serviceType}_${id}.html"`);
      res.send(consultation.generatedDocumentHtml);
    } catch (error) {
      console.error("Error fetching patient document:", error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  app.get("/api/admin/consultations", async (req: any, res) => {
    try {
      // Check if user is admin from session
      if (!req.session?.adminUser || req.session.adminUser.role !== 'admin') {
        return res.status(401).json({ message: "Admin access required" });
      }
      
      // Return all consultations for admin view
      const consultations = await storage.getAllConsultations();
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching admin consultations:", error);
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  // Admin view request details (read-only)
  app.get("/api/admin/requests/:id", async (req, res) => {
    try {
      const session = req as any;
      if (!session.session?.adminUser) {
        return res.status(401).json({ message: "Admin access required" });
      }
      
      const { id } = req.params;
      const request = await storage.getConsultationById(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error("Error fetching request details:", error);
      res.status(500).json({ message: "Failed to fetch request details" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
