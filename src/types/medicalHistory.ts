
export interface MedicalHistoryItem {
  id: string;
  description: string;
  cid?: string;
  ciap?: string;
  created_at: string;
}

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
