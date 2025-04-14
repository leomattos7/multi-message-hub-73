
export interface PatientRecord {
  id: string;
  patient_id: string;
  record_date: string;
  record_type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecordWithPatient extends PatientRecord {
  patient: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    organization_id?: string;
  };
}
