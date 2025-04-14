
export interface PatientRecord {
  id: string;
  patient_id: string;
  doctor_id?: string;
  record_type: string;
  record_date: string;
  content: string;
  created_at: string;
  updated_at?: string;
}
