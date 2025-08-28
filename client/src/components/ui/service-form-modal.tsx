import { useState, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Service request schemas
const prescriptionSchema = z.object({
  medication: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  previous_doctor: z.string().optional(),
  reason: z.string().min(1, "Reason is required"),
});

const medicalCertificateSchema = z.object({
  certificate_type: z.enum(["sick_leave", "fitness_to_work", "study_exemption", "general_medical"]),
  date_from: z.string().min(1, "Start date is required"),
  date_to: z.string().min(1, "End date is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
});

const mentalHealthSchema = z.object({
  support_type: z.enum(["mental_health_plan", "counseling_referral", "medication_review", "crisis_support"]),
  symptoms: z.string().optional(),
  previous_treatment: z.string().optional(),
});

const telehealthSchema = z.object({
  consultation_type: z.enum(["general", "follow_up", "chronic_disease", "preventive"]),
  preferred_time: z.enum(["morning", "afternoon", "evening", "anytime"]),
  health_concerns: z.string().min(1, "Health concerns are required"),
  current_medications: z.string().optional(),
});

const pathologySchema = z.object({
  test_type: z.enum(["blood_work", "diabetes_screening", "cholesterol", "thyroid", "vitamin_d", "other"]),
  reason_for_test: z.string().min(1, "Reason for test is required"),
  previous_tests: z.string().optional(),
  preferred_lab: z.string().optional(),
});

type ServiceFormProps = {
  serviceType: string;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export function ServiceFormModal({ serviceType, onSubmit, isLoading = false, children, isOpen, onClose }: ServiceFormProps) {

  const getSchema = () => {
    switch (serviceType) {
      case "prescription":
        return prescriptionSchema;
      case "medical_certificate":
        return medicalCertificateSchema;
      case "mental_health":
        return mentalHealthSchema;
      case "telehealth":
        return telehealthSchema;
      case "pathology":
        return pathologySchema;
      default:
        return z.object({});
    }
  };

  const getDefaultValues = () => {
    switch (serviceType) {
      case "prescription":
        return {
          medication: "",
          dosage: "",
          previous_doctor: "",
          reason: "",
        };
      case "medical_certificate":
        return {
          certificate_type: "sick_leave" as const,
          date_from: "",
          date_to: "",
          symptoms: "",
        };
      case "mental_health":
        return {
          support_type: "mental_health_plan" as const,
          symptoms: "",
          previous_treatment: "",
        };
      case "telehealth":
        return {
          consultation_type: "general" as const,
          preferred_time: "anytime" as const,
          health_concerns: "",
          current_medications: "",
        };
      case "pathology":
        return {
          test_type: "blood_work" as const,
          reason_for_test: "",
          previous_tests: "",
          preferred_lab: "",
        };
      default:
        return {};
    }
  };

  const getTitle = () => {
    switch (serviceType) {
      case "prescription":
        return "Request Prescription Renewal";
      case "medical_certificate":
        return "Request Medical Certificate";
      case "mental_health":
        return "Mental Health Support Request";
      case "telehealth":
        return "Book Telehealth Consultation";
      case "pathology":
        return "Request Pathology Referral";
      default:
        return "Request Service";
    }
  };

  const form = useForm<any>({
    resolver: zodResolver(getSchema()),
    defaultValues: getDefaultValues(),
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
    onClose();
    form.reset();
  };

  const renderFormFields = () => {
    switch (serviceType) {
      case "prescription":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="medication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medication Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Panadol, Ventolin"
                      data-testid="input-medication"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosage</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. 500mg twice daily"
                      data-testid="input-dosage"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previous_doctor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Prescribing Doctor (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Dr. Smith"
                      data-testid="input-previous-doctor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Prescription</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Brief description of medical condition requiring this medication"
                      data-testid="textarea-reason"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "medical_certificate":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="certificate_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-certificate-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sick_leave">Sick Leave</SelectItem>
                      <SelectItem value="fitness_to_work">Fitness to Work</SelectItem>
                      <SelectItem value="study_exemption">Study Exemption</SelectItem>
                      <SelectItem value="general_medical">General Medical Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date From</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      data-testid="input-date-from"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date To</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      data-testid="input-date-to"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms/Condition</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Describe your symptoms or medical condition"
                      data-testid="textarea-symptoms"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "mental_health":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="support_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-support-type">
                        <SelectValue placeholder="Select support type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mental_health_plan">Mental Health Care Plan</SelectItem>
                      <SelectItem value="counseling_referral">Counseling Referral</SelectItem>
                      <SelectItem value="medication_review">Medication Review</SelectItem>
                      <SelectItem value="crisis_support">Crisis Support</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Symptoms (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Briefly describe what you're experiencing"
                      data-testid="textarea-current-symptoms"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previous_treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Mental Health Treatment</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Any previous counseling, medications, or treatment"
                      data-testid="textarea-previous-treatment"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-freedoc-dark">
                <strong>Crisis Support:</strong> If you're having thoughts of self-harm, please call Lifeline 13 11 14 or visit your nearest emergency department.
              </p>
            </div>
          </div>
        );

      case "telehealth":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="consultation_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-consultation-type">
                        <SelectValue placeholder="Select consultation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General Consultation</SelectItem>
                      <SelectItem value="follow_up">Follow-up Appointment</SelectItem>
                      <SelectItem value="chronic_disease">Chronic Disease Management</SelectItem>
                      <SelectItem value="preventive">Preventive Health Check</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferred_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-preferred-time">
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9am-12pm)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12pm-5pm)</SelectItem>
                      <SelectItem value="evening">Evening (5pm-8pm)</SelectItem>
                      <SelectItem value="anytime">Any time available</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="health_concerns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Health Concerns</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Describe your current health concerns or symptoms"
                      data-testid="textarea-health-concerns"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Medications (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={2}
                      placeholder="List any medications you're currently taking"
                      data-testid="textarea-current-medications"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "pathology":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="test_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Type Required</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-test-type">
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="blood_work">Blood Work (FBC, Iron Studies, etc.)</SelectItem>
                      <SelectItem value="diabetes_screening">Diabetes Screening</SelectItem>
                      <SelectItem value="cholesterol">Cholesterol Check</SelectItem>
                      <SelectItem value="thyroid">Thyroid Function</SelectItem>
                      <SelectItem value="vitamin_d">Vitamin D Level</SelectItem>
                      <SelectItem value="other">Other (specify below)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason_for_test"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms or Reason for Test</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Describe symptoms or reason for requesting these tests"
                      data-testid="textarea-reason-for-test"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previous_tests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Similar Tests (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="When and what results (optional)"
                      data-testid="input-previous-tests"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferred_lab"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Pathology Lab (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-preferred-lab">
                        <SelectValue placeholder="No preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="australian_clinical_labs">Australian Clinical Labs</SelectItem>
                      <SelectItem value="healius">Healius Pathology</SelectItem>
                      <SelectItem value="qml">QML Pathology</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return <div>Form not available</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-freedoc-dark">
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {renderFormFields()}

            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-freedoc-blue hover:bg-freedoc-blue-dark"
                disabled={isLoading}
                data-testid="button-submit-request"
              >
                {isLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
