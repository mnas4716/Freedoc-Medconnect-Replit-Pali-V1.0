import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoleEnum = pgEnum("user_role", ["patient", "doctor", "admin"]);

// Consultation status enum
export const consultationStatusEnum = pgEnum("consultation_status", [
  "pending",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
]);

// Service type enum
export const serviceTypeEnum = pgEnum("service_type", [
  "prescription",
  "medical_certificate",
  "mental_health",
  "telehealth",
  "pathology",
]);

// Certificate type enum
export const certificateTypeEnum = pgEnum("certificate_type", [
  "sick_leave",
  "fitness_to_work",
  "study_exemption",
  "general_medical",
]);

// Users table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default("patient"),
  dateOfBirth: varchar("date_of_birth"),
  medicareNumber: varchar("medicare_number"),
  phoneNumber: varchar("phone_number"),
  isEmailVerified: boolean("is_email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// OTP verification table
export const otpVerifications = pgTable("otp_verifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email").notNull(),
  otp: varchar("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Doctors table
export const doctors = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  licenseNumber: varchar("license_number").unique().notNull(),
  specialty: varchar("specialty").notNull(),
  qualifications: text("qualifications"),
  isActive: boolean("is_active").default(true),
  workloadCount: integer("workload_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Consultations table
export const consultations = pgTable("consultations", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientId: varchar("patient_id").references(() => users.id).notNull(),
  doctorId: uuid("doctor_id").references(() => doctors.id),
  serviceType: serviceTypeEnum("service_type").notNull(),
  status: consultationStatusEnum("status").default("pending"),
  requestData: jsonb("request_data").notNull(),
  doctorNotes: text("doctor_notes"),
  prescriptionData: jsonb("prescription_data"),
  certificateData: jsonb("certificate_data"),
  generatedDocumentPath: varchar("generated_document_path"),
  generatedDocumentHtml: text("generated_document_html"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Medical certificates table
export const medicalCertificates = pgTable("medical_certificates", {
  id: uuid("id").defaultRandom().primaryKey(),
  consultationId: uuid("consultation_id").references(() => consultations.id).notNull(),
  patientId: varchar("patient_id").references(() => users.id).notNull(),
  doctorId: uuid("doctor_id").references(() => doctors.id).notNull(),
  certificateType: certificateTypeEnum("certificate_type").notNull(),
  dateFrom: timestamp("date_from").notNull(),
  dateTo: timestamp("date_to").notNull(),
  condition: text("condition").notNull(),
  restrictions: text("restrictions"),
  pdfPath: varchar("pdf_path"),
  issuedAt: timestamp("issued_at").defaultNow(),
});

// Prescriptions table
export const prescriptions = pgTable("prescriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  consultationId: uuid("consultation_id").references(() => consultations.id).notNull(),
  patientId: varchar("patient_id").references(() => users.id).notNull(),
  doctorId: uuid("doctor_id").references(() => doctors.id).notNull(),
  medicationName: varchar("medication_name").notNull(),
  dosage: varchar("dosage").notNull(),
  quantity: varchar("quantity").notNull(),
  repeats: integer("repeats").default(0),
  instructions: text("instructions"),
  pdfPath: varchar("pdf_path"),
  issuedAt: timestamp("issued_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  doctorProfile: one(doctors, {
    fields: [users.id],
    references: [doctors.userId],
  }),
  consultationsAsPatient: many(consultations, {
    relationName: "patientConsultations",
  }),
  medicalCertificates: many(medicalCertificates),
  prescriptions: many(prescriptions),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, {
    fields: [doctors.userId],
    references: [users.id],
  }),
  consultations: many(consultations),
  medicalCertificates: many(medicalCertificates),
  prescriptions: many(prescriptions),
}));

export const consultationsRelations = relations(consultations, ({ one, many }) => ({
  patient: one(users, {
    fields: [consultations.patientId],
    references: [users.id],
    relationName: "patientConsultations",
  }),
  doctor: one(doctors, {
    fields: [consultations.doctorId],
    references: [doctors.id],
  }),
  medicalCertificate: one(medicalCertificates),
  prescription: one(prescriptions),
}));

export const medicalCertificatesRelations = relations(medicalCertificates, ({ one }) => ({
  consultation: one(consultations, {
    fields: [medicalCertificates.consultationId],
    references: [consultations.id],
  }),
  patient: one(users, {
    fields: [medicalCertificates.patientId],
    references: [users.id],
  }),
  doctor: one(doctors, {
    fields: [medicalCertificates.doctorId],
    references: [doctors.id],
  }),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  consultation: one(consultations, {
    fields: [prescriptions.consultationId],
    references: [consultations.id],
  }),
  patient: one(users, {
    fields: [prescriptions.patientId],
    references: [users.id],
  }),
  doctor: one(doctors, {
    fields: [prescriptions.doctorId],
    references: [doctors.id],
  }),
}));

// Insert schemas
export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertOtpSchema = createInsertSchema(otpVerifications).omit({
  id: true,
  createdAt: true,
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMedicalCertificateSchema = createInsertSchema(medicalCertificates).omit({
  id: true,
  issuedAt: true,
});

export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({
  id: true,
  issuedAt: true,
});

// Registration schema with additional validation
export const registrationSchema = z.object({
  email: z.string().email("Invalid email format"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  medicareNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
});

// OTP verification schema
export const otpVerificationSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

// Service request schemas
export const prescriptionRequestSchema = z.object({
  medication: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  previous_doctor: z.string().optional(),
  reason: z.string().min(1, "Reason is required"),
});

export const medicalCertificateRequestSchema = z.object({
  certificate_type: z.enum(["sick_leave", "fitness_to_work", "study_exemption", "general_medical"]),
  date_from: z.string().min(1, "Start date is required"),
  date_to: z.string().min(1, "End date is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
});

export const mentalHealthRequestSchema = z.object({
  support_type: z.enum(["mental_health_plan", "counseling_referral", "medication_review", "crisis_support"]),
  symptoms: z.string().optional(),
  previous_treatment: z.string().optional(),
});

export const telehealthRequestSchema = z.object({
  consultation_type: z.enum(["general", "follow_up", "chronic_disease", "preventive"]),
  preferred_time: z.enum(["morning", "afternoon", "evening", "anytime"]),
  health_concerns: z.string().min(1, "Health concerns are required"),
  current_medications: z.string().optional(),
});

export const pathologyRequestSchema = z.object({
  test_type: z.enum(["blood_work", "diabetes_screening", "cholesterol", "thyroid", "vitamin_d", "other"]),
  reason_for_test: z.string().min(1, "Reason for test is required"),
  previous_tests: z.string().optional(),
  preferred_lab: z.string().optional(),
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertOtp = z.infer<typeof insertOtpSchema>;
export type OtpVerification = typeof otpVerifications.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;
export type InsertMedicalCertificate = z.infer<typeof insertMedicalCertificateSchema>;
export type MedicalCertificate = typeof medicalCertificates.$inferSelect;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
export type Prescription = typeof prescriptions.$inferSelect;
export type RegistrationData = z.infer<typeof registrationSchema>;
export type OtpVerificationData = z.infer<typeof otpVerificationSchema>;
