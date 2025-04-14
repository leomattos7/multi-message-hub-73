
export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  date: string;
  time: string;
  end_time: string;
  type: string;
  status: string;
  notes: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  patient: {
    name: string;
    email?: string;
    phone?: string;
  };
}
