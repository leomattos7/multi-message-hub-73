
import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "@/integrations/supabase/services/appointmentService";

// Define and export the Appointment interface
export interface Appointment {
  id: string;
  patient_id: string;
  start_time: string;
  end_time: string;
  status: "aguardando" | "confirmado" | "cancelado";
  payment_method?: "Particular" | "Convênio";
  notes?: string;
  consultation_type_id?: string;
  doctor_id: string;
  date: string; // Date in YYYY-MM-DD format
  time: string; // Time in HH:MM format
  patient?: {
    full_name: string;
    email?: string;
    phone?: string;
  };
  type?: string; // Add the type property
}

export function useAppointments(date?: Date) {
  const { 
    data: appointments, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["appointments", date ? date.toISOString().split('T')[0] : undefined],
    queryFn: async () => {
      return await appointmentService.getAppointments(date);
    },
  });

  return {
    appointments: appointments || [],
    isLoading,
    error,
    refetch
  };
}
