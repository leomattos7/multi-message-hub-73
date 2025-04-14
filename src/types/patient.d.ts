
export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  cpf?: string;
  organization_id?: string;
  doctor_id: string;
  insurance_name?: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}
