
export interface DoctorLink {
  id: string;
  doctor_id: string;
  title: string;
  url: string;
  icon?: string;
  is_active?: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
