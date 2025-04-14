import { Patient } from "@/types";

export interface PatientFilters {
  name?: string;
  email?: string;
  phone?: string;
  paymentMethod?: string;
  insuranceName?: string;
  biologicalSex?: string;
  genderIdentity?: string;
  lastActivity?: string;
  hasAppointment?: "all" | "yes" | "no";
}

export const PATIENT_TABLE = 'patients';