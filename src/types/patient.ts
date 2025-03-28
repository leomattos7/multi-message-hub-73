
export interface Patient {
  id: string;
  email?: string;
  phone?: string;
  address?: any;
  notes?: string;
  date_of_birth?: string;
  biological_sex?: string;
  gender_identity?: string;
  cpf?: string;
  payment_form?: string;
  full_name: string;
  doctor_id?: string;
  created_at?: string;
  lastMessageDate?: Date | null;
  lastAppointmentDate?: Date | null;
  // For backward compatibility with old code
  name?: string;
  birth_date?: string;
  insurance_name?: string;
  payment_method?: string;
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
