import {
  users,
  doctors,
  consultations,
  medicalCertificates,
  prescriptions,
  otpVerifications,
  type User,
  type UpsertUser,
  type Doctor,
  type InsertDoctor,
  type Consultation,
  type InsertConsultation,
  type MedicalCertificate,
  type InsertMedicalCertificate,
  type Prescription,
  type InsertPrescription,
  type OtpVerification,
  type InsertOtp,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserEmailVerification(userId: string, verified: boolean): Promise<void>;

  // OTP operations
  createOtp(otpData: InsertOtp): Promise<OtpVerification>;
  getOtpByEmail(email: string): Promise<OtpVerification | undefined>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
  deleteExpiredOtps(): Promise<void>;

  // Doctor operations
  createDoctor(doctorData: InsertDoctor): Promise<Doctor>;
  getDoctorByUserId(userId: string): Promise<Doctor | undefined>;
  getDoctorWithUserById(doctorId: string): Promise<(Doctor & { user?: User }) | undefined>;
  getAllDoctors(): Promise<Doctor[]>;
  getActiveDoctors(): Promise<Doctor[]>;
  updateDoctorWorkload(doctorId: string, increment: number): Promise<void>;

  // Consultation operations
  createConsultation(consultationData: InsertConsultation): Promise<Consultation>;
  getConsultationById(id: string): Promise<Consultation | undefined>;
  getConsultationsByPatient(patientId: string): Promise<Consultation[]>;
  getConsultationsByDoctor(doctorId: string): Promise<Consultation[]>;
  getPendingConsultations(): Promise<Consultation[]>;
  getAllConsultations(): Promise<Consultation[]>;
  updateConsultationStatus(
    id: string,
    status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled",
    doctorNotes?: string
  ): Promise<void>;
  assignDoctorToConsultation(consultationId: string, doctorId: string): Promise<void>;

  // Medical certificate operations
  createMedicalCertificate(certData: InsertMedicalCertificate): Promise<MedicalCertificate>;
  getMedicalCertificatesByPatient(patientId: string): Promise<MedicalCertificate[]>;
  updateMedicalCertificatePdf(id: string, pdfPath: string): Promise<void>;

  // Prescription operations
  createPrescription(prescData: InsertPrescription): Promise<Prescription>;
  getPrescriptionsByPatient(patientId: string): Promise<Prescription[]>;
  updatePrescriptionPdf(id: string, pdfPath: string): Promise<void>;

  // Request assignment operations
  assignConsultationToNextDoctor(patientId: string, serviceType: string, requestData: any): Promise<Consultation>;
  reassignConsultation(consultationId: string, newDoctorId: string): Promise<Consultation>;
  updateConsultationNotes(consultationId: string, notes: string): Promise<Consultation>;
  updateConsultationDocument(consultationId: string, documentPath: string, documentHtml: string): Promise<void>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAllDoctorsWithDetails(): Promise<(Doctor & { user?: User })[]>;
  updateUser(id: string, userData: Partial<User>): Promise<boolean>;
  deleteUser(id: string): Promise<boolean>;
  updateDoctor(id: string, doctorData: Partial<Doctor>): Promise<boolean>;
  deleteDoctor(id: string): Promise<boolean>;

  // Analytics
  getSystemStats(): Promise<{
    totalUsers: number;
    totalDoctors: number;
    totalConsultations: number;
    pendingConsultations: number;
    completedConsultations: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Simple implementations that work with the existing database
  // System analytics methods
  async getSystemStats() {
    try {
      const totalUsers = await db.select({ count: sql`count(*)` }).from(users);
      const totalDoctors = await db.select({ count: sql`count(*)` }).from(doctors);
      const totalConsultations = await db.select({ count: sql`count(*)` }).from(consultations);
      const pendingConsultations = await db.select({ count: sql`count(*)` }).from(consultations).where(eq(consultations.status, 'pending'));
      const completedConsultations = await db.select({ count: sql`count(*)` }).from(consultations).where(eq(consultations.status, 'completed'));

      return {
        totalUsers: Number(totalUsers[0]?.count) || 0,
        totalDoctors: Number(totalDoctors[0]?.count) || 0,
        totalConsultations: Number(totalConsultations[0]?.count) || 0,
        pendingConsultations: Number(pendingConsultations[0]?.count) || 0,
        completedConsultations: Number(completedConsultations[0]?.count) || 0
      };
    } catch (error) {
      console.error("Error fetching system stats:", error);
      return {
        totalUsers: 0,
        totalDoctors: 0,
        totalConsultations: 0,
        pendingConsultations: 0,
        completedConsultations: 0
      };
    }
  }

  async getAllConsultations(): Promise<Consultation[]> {
    try {
      const allConsultations = await db.select().from(consultations).orderBy(desc(consultations.createdAt));
      return allConsultations;
    } catch (error) {
      console.error("Error fetching consultations:", error);
      return [];
    }
  }

  async getConsultationsByDoctor(doctorId: string) {
    try {
      const doctorConsultations = await db
        .select()
        .from(consultations)
        .where(eq(consultations.doctorId, doctorId));
      return doctorConsultations;
    } catch (error) {
      console.error("Error fetching doctor consultations:", error);
      return [];
    }
  }

  async updateConsultationStatus(consultationId: string, status: string, doctorNotes?: string) {
    try {
      await db
        .update(consultations)
        .set({ 
          status,
          doctorNotes,
          updatedAt: new Date()
        })
        .where(eq(consultations.id, consultationId));
      return true;
    } catch (error) {
      console.error("Error updating consultation status:", error);
      return false;
    }
  }
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUserEmailVerification(userId: string, verified: boolean): Promise<void> {
    await db
      .update(users)
      .set({ isEmailVerified: verified, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  // OTP operations
  async createOtp(otpData: InsertOtp): Promise<OtpVerification> {
    const [otp] = await db.insert(otpVerifications).values(otpData).returning();
    return otp;
  }

  async getOtpByEmail(email: string): Promise<OtpVerification | undefined> {
    const [otp] = await db
      .select()
      .from(otpVerifications)
      .where(and(eq(otpVerifications.email, email), eq(otpVerifications.verified, false)))
      .orderBy(desc(otpVerifications.createdAt));
    return otp;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const [verification] = await db
      .select()
      .from(otpVerifications)
      .where(
        and(
          eq(otpVerifications.email, email),
          eq(otpVerifications.otp, otp),
          eq(otpVerifications.verified, false)
        )
      );

    if (verification && new Date() < verification.expiresAt) {
      await db
        .update(otpVerifications)
        .set({ verified: true })
        .where(eq(otpVerifications.id, verification.id));
      return true;
    }
    return false;
  }

  async deleteExpiredOtps(): Promise<void> {
    await db.delete(otpVerifications).where(sql`expires_at < NOW()`);
  }

  // Doctor operations
  async createDoctor(doctorData: InsertDoctor): Promise<Doctor> {
    const [doctor] = await db.insert(doctors).values(doctorData).returning();
    return doctor;
  }

  async getDoctorByUserId(userId: string): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.userId, userId));
    return doctor;
  }

  async getDoctorWithUserById(doctorId: string): Promise<(Doctor & { user?: User }) | undefined> {
    const result = await db
      .select()
      .from(doctors)
      .leftJoin(users, eq(doctors.userId, users.id))
      .where(eq(doctors.id, doctorId));

    if (result.length === 0) return undefined;

    const row = result[0];
    return {
      ...row.doctors,
      user: row.users || undefined,
    };
  }

  async getAllDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors);
  }

  async getActiveDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors).where(eq(doctors.isActive, true));
  }

  async updateDoctorWorkload(doctorId: string, increment: number): Promise<void> {
    await db
      .update(doctors)
      .set({
        workloadCount: sql`${doctors.workloadCount} + ${increment}`,
        updatedAt: new Date(),
      })
      .where(eq(doctors.id, doctorId));
  }

  // Consultation operations
  async createConsultation(consultationData: InsertConsultation): Promise<Consultation> {
    const [consultation] = await db.insert(consultations).values(consultationData).returning();
    return consultation;
  }

  async getConsultationById(id: string): Promise<Consultation | undefined> {
    const [consultation] = await db.select().from(consultations).where(eq(consultations.id, id));
    return consultation;
  }

  async getConsultationsByPatient(patientId: string): Promise<Consultation[]> {
    return await db
      .select()
      .from(consultations)
      .where(eq(consultations.patientId, patientId))
      .orderBy(desc(consultations.createdAt));
  }

  async getConsultationsByDoctor(doctorId: string): Promise<Consultation[]> {
    return await db
      .select()
      .from(consultations)
      .where(eq(consultations.doctorId, doctorId))
      .orderBy(desc(consultations.createdAt));
  }

  async getPendingConsultations(): Promise<Consultation[]> {
    return await db
      .select()
      .from(consultations)
      .where(eq(consultations.status, "pending"))
      .orderBy(asc(consultations.createdAt));
  }

  async getAllConsultations(): Promise<Consultation[]> {
    return await db
      .select()
      .from(consultations)
      .orderBy(desc(consultations.createdAt));
  }

  async updateConsultationStatus(
    id: string,
    status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled",
    doctorNotes?: string
  ): Promise<void> {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (doctorNotes) {
      updateData.doctorNotes = doctorNotes;
    }

    if (status === "completed") {
      updateData.completedAt = new Date();
    }

    await db.update(consultations).set(updateData).where(eq(consultations.id, id));
  }

  async assignDoctorToConsultation(consultationId: string, doctorId: string): Promise<void> {
    await db
      .update(consultations)
      .set({
        doctorId,
        status: "assigned",
        updatedAt: new Date(),
      })
      .where(eq(consultations.id, consultationId));

    // Update doctor workload
    await this.updateDoctorWorkload(doctorId, 1);
  }

  // Medical certificate operations
  async createMedicalCertificate(certData: InsertMedicalCertificate): Promise<MedicalCertificate> {
    const [certificate] = await db.insert(medicalCertificates).values(certData).returning();
    return certificate;
  }

  async getMedicalCertificatesByPatient(patientId: string): Promise<MedicalCertificate[]> {
    return await db
      .select()
      .from(medicalCertificates)
      .where(eq(medicalCertificates.patientId, patientId))
      .orderBy(desc(medicalCertificates.issuedAt));
  }

  async updateMedicalCertificatePdf(id: string, pdfPath: string): Promise<void> {
    await db
      .update(medicalCertificates)
      .set({ pdfPath })
      .where(eq(medicalCertificates.id, id));
  }

  // Prescription operations
  async createPrescription(prescData: InsertPrescription): Promise<Prescription> {
    const [prescription] = await db.insert(prescriptions).values(prescData).returning();
    return prescription;
  }

  async getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
    return await db
      .select()
      .from(prescriptions)
      .where(eq(prescriptions.patientId, patientId))
      .orderBy(desc(prescriptions.issuedAt));
  }

  async updatePrescriptionPdf(id: string, pdfPath: string): Promise<void> {
    await db.update(prescriptions).set({ pdfPath }).where(eq(prescriptions.id, id));
  }

  // Analytics
  async getSystemStats(): Promise<{
    totalUsers: number;
    totalDoctors: number;
    totalConsultations: number;
    pendingConsultations: number;
    completedConsultations: number;
  }> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [doctorCount] = await db.select({ count: count() }).from(doctors);
    const [consultationCount] = await db.select({ count: count() }).from(consultations);
    const [pendingCount] = await db
      .select({ count: count() })
      .from(consultations)
      .where(eq(consultations.status, "pending"));
    const [completedCount] = await db
      .select({ count: count() })
      .from(consultations)
      .where(eq(consultations.status, "completed"));

    return {
      totalUsers: userCount.count,
      totalDoctors: doctorCount.count,
      totalConsultations: consultationCount.count,
      pendingConsultations: pendingCount.count,
      completedConsultations: completedCount.count,
    };
  }

  // User management operations for admin
  async getAllUsers(): Promise<User[]> {
    try {
      const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
      return allUsers;
    } catch (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<boolean> {
    try {
      await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      await db.delete(users).where(eq(users.id, userId));
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  // Request assignment operations - Auto-assign to doctors in rotation
  async assignConsultationToNextDoctor(patientId: string, serviceType: any, requestData: any): Promise<Consultation> {
    try {
      // Get all active doctors sorted by workload (ascending)
      const activeDoctors = await db
        .select()
        .from(doctors)
        .where(eq(doctors.isActive, true))
        .orderBy(asc(doctors.workloadCount));

      if (activeDoctors.length === 0) {
        throw new Error("No active doctors available");
      }

      // Assign to doctor with lowest workload
      const assignedDoctor = activeDoctors[0];

      // Create consultation
      const [consultation] = await db
        .insert(consultations)
        .values({
          patientId,
          doctorId: assignedDoctor.id,
          serviceType,
          requestData,
          status: "assigned",
        })
        .returning();

      // Update doctor workload
      const newWorkloadCount = (assignedDoctor.workloadCount || 0) + 1;
      await db
        .update(doctors)
        .set({ workloadCount: newWorkloadCount, updatedAt: new Date() })
        .where(eq(doctors.id, assignedDoctor.id));

      return consultation;
    } catch (error) {
      console.error("Error assigning consultation to doctor:", error);
      throw error;
    }
  }

  async reassignConsultation(consultationId: string, newDoctorId: string): Promise<Consultation> {
    try {
      // Get the current consultation
      const [currentConsultation] = await db
        .select()
        .from(consultations)
        .where(eq(consultations.id, consultationId));

      if (!currentConsultation) {
        throw new Error("Consultation not found");
      }

      // If there's a current doctor, decrease their workload
      if (currentConsultation.doctorId) {
        const [currentDoctor] = await db
          .select()
          .from(doctors)
          .where(eq(doctors.id, currentConsultation.doctorId));

        if (currentDoctor) {
          await db
            .update(doctors)
            .set({ 
              workloadCount: Math.max(0, currentDoctor.workloadCount - 1),
              updatedAt: new Date()
            })
            .where(eq(doctors.id, currentDoctor.id));
        }
      }

      // Update consultation with new doctor
      const [updatedConsultation] = await db
        .update(consultations)
        .set({
          doctorId: newDoctorId,
          status: "assigned",
          updatedAt: new Date(),
        })
        .where(eq(consultations.id, consultationId))
        .returning();

      // Increase new doctor's workload
      const [newDoctor] = await db
        .select()
        .from(doctors)
        .where(eq(doctors.id, newDoctorId));

      if (newDoctor && newDoctor.workloadCount !== null) {
        await db
          .update(doctors)
          .set({ 
            workloadCount: newDoctor.workloadCount + 1,
            updatedAt: new Date()
          })
          .where(eq(doctors.id, newDoctorId));
      }

      return updatedConsultation;
    } catch (error) {
      console.error("Error reassigning consultation:", error);
      throw error;
    }
  }

  async updateConsultationNotes(consultationId: string, notes: string): Promise<Consultation> {
    try {
      const [updatedConsultation] = await db
        .update(consultations)
        .set({
          doctorNotes: notes,
          updatedAt: new Date(),
        })
        .where(eq(consultations.id, consultationId))
        .returning();

      return updatedConsultation;
    } catch (error) {
      console.error("Error updating consultation notes:", error);
      throw error;
    }
  }

  // Doctor management operations for admin
  async getAllDoctorsWithDetails(): Promise<(Doctor & { user?: User })[]> {
    try {
      const result = await db
        .select()
        .from(doctors)
        .leftJoin(users, eq(doctors.userId, users.id))
        .orderBy(desc(doctors.createdAt));

      return result.map(row => ({
        ...row.doctors,
        user: row.users || undefined,
      }));
    } catch (error) {
      console.error("Error fetching doctors with details:", error);
      return [];
    }
  }

  async updateDoctor(doctorId: string, doctorData: Partial<Doctor>): Promise<boolean> {
    try {
      await db
        .update(doctors)
        .set({
          ...doctorData,
          updatedAt: new Date()
        })
        .where(eq(doctors.id, doctorId));
      return true;
    } catch (error) {
      console.error("Error updating doctor:", error);
      return false;
    }
  }

  async deleteDoctor(doctorId: string): Promise<boolean> {
    try {
      await db.delete(doctors).where(eq(doctors.id, doctorId));
      return true;
    } catch (error) {
      console.error("Error deleting doctor:", error);
      return false;
    }
  }

  async updateConsultationDocument(consultationId: string, documentPath: string, documentHtml: string): Promise<void> {
    try {
      await db
        .update(consultations)
        .set({
          generatedDocumentPath: documentPath,
          generatedDocumentHtml: documentHtml,
          updatedAt: new Date()
        })
        .where(eq(consultations.id, consultationId));
    } catch (error) {
      console.error("Error updating consultation document:", error);
      throw error;
    }
    return savedPath;
  }

  async getAllDoctorsWithDetails() {
    const doctorsWithDetails = await db
      .select({
        id: doctors.id,
        userId: doctors.userId,
        licenseNumber: doctors.licenseNumber,
        specialty: doctors.specialty,
        qualifications: doctors.qualifications,
        isActive: doctors.isActive,
        workloadCount: doctors.workloadCount,
        createdAt: doctors.createdAt,
        updatedAt: doctors.updatedAt,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        password: users.password,
      })
      .from(doctors)
      .leftJoin(users, eq(doctors.userId, users.id));
    return doctorsWithDetails;
  }

  async getAllUsersWithPasswords() {
    const allUsers = await db.select().from(users);
    return allUsers;
  }

  async updateUser(userId: string, userData: any) {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async updateDoctor(doctorId: string, doctorData: any) {
    const [updatedDoctor] = await db
      .update(doctors)
      .set({ ...doctorData, updatedAt: new Date() })
      .where(eq(doctors.id, doctorId))
      .returning();
    return updatedDoctor;
  }

  async getAdminStats() {
    const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [totalDoctors] = await db.select({ count: sql<number>`count(*)` }).from(doctors);
    const [totalConsultations] = await db.select({ count: sql<number>`count(*)` }).from(consultations);
    const [pendingConsultations] = await db.select({ count: sql<number>`count(*)` }).from(consultations).where(eq(consultations.status, 'pending'));
    const [completedConsultations] = await db.select({ count: sql<number>`count(*)` }).from(consultations).where(eq(consultations.status, 'completed'));

    return {
      totalUsers: totalUsers.count || 0,
      totalDoctors: totalDoctors.count || 0,
      totalConsultations: totalConsultations.count || 0,
      pendingConsultations: pendingConsultations.count || 0,
      completedConsultations: completedConsultations.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
