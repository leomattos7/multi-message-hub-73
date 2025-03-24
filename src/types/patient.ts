
export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  birth_date?: string;
  biological_sex?: string;
  gender_identity?: string;
  cpf?: string;
  payment_method?: string;
  insurance_name?: string;
  lastMessageDate?: Date | null;
  lastAppointmentDate?: Date | null;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  record_date: string;
  record_type: string;
  content: string;
  created_at: string;
  updated_at: string;
}
