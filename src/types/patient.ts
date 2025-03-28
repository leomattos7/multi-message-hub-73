
export interface Patient {
  id: string;
  email?: string;
  phone?: string;
  address?: any;
  notes?: string;
  date_of_birth?: string;
  biological_sex?: "Masculino" | "Feminino" | "Intersexo" | "Não Informado";
  gender_identity?: "Não Informado" | "Homem" | "Mulher" | "Não-Binário" | "Outro";
  cpf?: string;
  payment_form?: "Particular" | "Convênio";
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
  record_count?: number;
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
