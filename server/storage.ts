import {
  users,
  doctors,
  consultations,
  otpVerifications,
  type User,
  type Doctor,
  type Consultation,
  type OtpVerification,
  type UpsertUser,
  type InsertDoctor,
  type InsertConsultation,
  type InsertOtp,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Admin operations
  getAllUsersWithPasswords(): Promise<User[]>;
  getAllDoctorsWithDetails(): Promise<any[]>;
  updateUser(userId: string, userData: any): Promise<User>;
  updateDoctor(doctorId: string, doctorData: any): Promise<Doctor>;
  getAdminStats(): Promise<any>;
  
  // Other existing operations
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserEmailVerification(userId: string, verified: boolean): Promise<void>;
  createOtp(otpData: InsertOtp): Promise<OtpVerification>;
  getOtpByEmail(email: string): Promise<OtpVerification | undefined>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
  createDoctor(doctorData: InsertDoctor): Promise<Doctor>;
  getDoctorByUserId(userId: string): Promise<Doctor | undefined>;
  getDoctorById(id: string): Promise<Doctor | undefined>;
  getDoctorByLicenseNumber(licenseNumber: string): Promise<Doctor | undefined>;
  getAllDoctors(): Promise<Doctor[]>;
  getActiveDoctors(): Promise<Doctor[]>;
  updateDoctorWorkload(doctorId: string, increment: number): Promise<void>;
  createConsultation(consultationData: InsertConsultation): Promise<Consultation>;
  getConsultationById(id: string): Promise<Consultation | undefined>;
  getConsultationsByPatient(patientId: string): Promise<Consultation[]>;
  getConsultationsByDoctor(doctorId: string): Promise<Consultation[]>;
  getPendingConsultations(): Promise<Consultation[]>;
  getAllConsultations(): Promise<Consultation[]>;
  updateConsultationStatus(id: string, status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled", doctorNotes?: string): Promise<void>;
  assignDoctorToConsultation(consultationId: string, doctorId: string): Promise<void>;
  updateConsultationDocument(consultationId: string, documentPath: string, documentHtml: string): Promise<string>;
}

export class DatabaseStorage implements IStorage {
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

  // Admin operations
  async getAllUsersWithPasswords(): Promise<User[]> {
    const allUsers = await db.select().from(users);
    return allUsers;
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

  async updateUser(userId: string, userData: any): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async updateDoctor(doctorId: string, doctorData: any): Promise<Doctor> {
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

  // Doctor operations
  async createDoctor(doctorData: InsertDoctor): Promise<Doctor> {
    const [doctor] = await db.insert(doctors).values(doctorData).returning();
    return doctor;
  }

  async getDoctorByUserId(userId: string): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.userId, userId));
    return doctor;
  }

  async getDoctorById(id: string): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor;
  }

  async getDoctorByLicenseNumber(licenseNumber: string): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.licenseNumber, licenseNumber));
    return doctor;
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
  }

  async updateConsultationDocument(consultationId: string, documentPath: string, documentHtml: string): Promise<string> {
    try {
      await db
        .update(consultations)
        .set({
          generatedDocumentPath: documentPath,
          generatedDocumentHtml: documentHtml,
          updatedAt: new Date(),
        })
        .where(eq(consultations.id, consultationId));
    } catch (error) {
      console.error("Error updating consultation document:", error);
      throw error;
    }
    return documentPath;
  }
}

export const storage = new DatabaseStorage();