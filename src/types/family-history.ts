
export interface FamilyHistory {
  id: string;
  patient_id: string;
  condition: string;
  relationship: string;
  age_at_diagnosis?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}
