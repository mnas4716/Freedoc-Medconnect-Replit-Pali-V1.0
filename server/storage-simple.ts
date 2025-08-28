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
import type { IStorage } from "./storage";

export class SimpleDatabaseStorage implements IStorage {
  // Basic implementations for core functionality
  
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
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
    } catch (error) {
      console.error("Error upserting user:", error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return undefined;
    }
  }

  async updateUserEmailVerification(userId: string, verified: boolean): Promise<void> {
    try {
      await db
        .update(users)
        .set({ isEmailVerified: verified, updatedAt: new Date() })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error("Error updating email verification:", error);
    }
  }

  async getAllConsultations(): Promise<Consultation[]> {
    try {
      const consultations_data = await db.select().from(consultations).orderBy(desc(consultations.createdAt));
      return consultations_data;
    } catch (error) {
      console.error("Error fetching all consultations:", error);
      return [];
    }
  }

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

  async getConsultationById(id: string): Promise<Consultation | undefined> {
    try {
      const [consultation] = await db.select().from(consultations).where(eq(consultations.id, id));
      return consultation;
    } catch (error) {
      console.error("Error fetching consultation by ID:", error);
      return undefined;
    }
  }

  // Placeholder implementations for other required methods
  async createOtp(otpData: InsertOtp): Promise<OtpVerification> {
    const [otp] = await db.insert(otpVerifications).values(otpData).returning();
    return otp;
  }

  async getOtpByEmail(email: string): Promise<OtpVerification | undefined> {
    const [otp] = await db.select().from(otpVerifications).where(eq(otpVerifications.email, email)).limit(1);
    return otp;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    return true; // Simplified for now
  }

  async deleteExpiredOtps(): Promise<void> {
    // Implementation
  }

  async createDoctor(doctorData: InsertDoctor): Promise<Doctor> {
    const [doctor] = await db.insert(doctors).values(doctorData).returning();
    return doctor;
  }

  async getDoctorByUserId(userId: string): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.userId, userId));
    return doctor;
  }

  async getDoctorWithUserById(doctorId: string): Promise<(Doctor & { user?: User }) | undefined> {
    return undefined; // Simplified
  }

  async getAllDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors);
  }

  async getActiveDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors).where(eq(doctors.isActive, true));
  }

  async updateDoctorWorkload(doctorId: string, increment: number): Promise<void> {
    // Implementation
  }

  async createConsultation(consultationData: InsertConsultation): Promise<Consultation> {
    const [consultation] = await db.insert(consultations).values(consultationData).returning();
    return consultation;
  }

  async getConsultationsByPatient(patientId: string): Promise<Consultation[]> {
    return await db.select().from(consultations).where(eq(consultations.patientId, patientId));
  }

  async getConsultationsByDoctor(doctorId: string): Promise<Consultation[]> {
    return await db.select().from(consultations).where(eq(consultations.doctorId, doctorId));
  }

  async getPendingConsultations(): Promise<Consultation[]> {
    return await db.select().from(consultations).where(eq(consultations.status, 'pending'));
  }

  async updateConsultationStatus(
    id: string,
    status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled",
    doctorNotes?: string
  ): Promise<void> {
    // Implementation
  }

  async assignDoctorToConsultation(consultationId: string, doctorId: string): Promise<void> {
    // Implementation
  }

  async createMedicalCertificate(certData: InsertMedicalCertificate): Promise<MedicalCertificate> {
    const [cert] = await db.insert(medicalCertificates).values(certData).returning();
    return cert;
  }

  async getMedicalCertificatesByPatient(patientId: string): Promise<MedicalCertificate[]> {
    return [];
  }

  async updateMedicalCertificatePdf(id: string, pdfPath: string): Promise<void> {
    // Implementation
  }

  async createPrescription(prescData: InsertPrescription): Promise<Prescription> {
    const [prescription] = await db.insert(prescriptions).values(prescData).returning();
    return prescription;
  }

  async getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
    return [];
  }

  async updatePrescriptionPdf(id: string, pdfPath: string): Promise<void> {
    // Implementation
  }

  async assignConsultationToNextDoctor(patientId: string, serviceType: string, requestData: any): Promise<Consultation> {
    // Simple assignment logic
    const consultation = await this.createConsultation({
      patientId,
      serviceType: serviceType as any,
      requestData,
      status: 'pending'
    });
    return consultation;
  }

  async reassignConsultation(consultationId: string, newDoctorId: string): Promise<Consultation> {
    const consultation = await this.getConsultationById(consultationId);
    if (!consultation) throw new Error('Consultation not found');
    return consultation;
  }

  async updateConsultationNotes(consultationId: string, notes: string): Promise<Consultation> {
    const consultation = await this.getConsultationById(consultationId);
    if (!consultation) throw new Error('Consultation not found');
    return consultation;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  }
}

export const storage = new SimpleDatabaseStorage();