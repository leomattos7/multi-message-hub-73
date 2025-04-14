
export interface MedicalHistory {
  id: string;
  patient_id: string;
  condition: string;
  diagnosis_date?: string;
  treatment?: string;
  status: "active" | "resolved" | "chronic";
  notes?: string;
  created_at: string;
  updated_at: string;
}
