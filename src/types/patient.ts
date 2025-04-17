export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  notes?: string;
  doctor_id?: string;
  organization_id?: string;
  payment_method?: string;
  insurance_name?: string;
  birth_date?: string;
  biological_sex?: string;
  gender_identity?: string;
  gender?: string; // Added for backward compatibility
  cpf?: string;

  // UI helper properties
  lastMessageDate?: Date | null;
  lastAppointmentDate?: Date | null;
}

// Interface para o tipo de retorno da API de pacientes
export interface PatientApiResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  notes?: string;
  doctor_id?: string;
  organization_id?: string;
  payment_method?: string;
  insurance_name?: string;
  birth_date?: string;
  biological_sex?: string;
  gender_identity?: string;
  cpf?: string;
}
