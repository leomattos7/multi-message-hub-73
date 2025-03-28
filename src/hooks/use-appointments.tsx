
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Appointment = {
  id: string;
  patient_id: string;
  date: string;
  time: string;
  end_time?: string; // Add end_time as optional field
  type: string;
  status: string;
  payment_method?: string;
  notes?: string;
  patient?: {
    name: string;
    email?: string;
    phone?: string;
  };
};

export function useAppointments(date?: Date) {
  const formattedDate = date ? date.toISOString().split('T')[0] : undefined;

  const { data: appointments, isLoading, error, refetch } = useQuery({
    queryKey: ["appointments", formattedDate],
    queryFn: async () => {
      // If no date is provided, fetch all appointments
      let query = supabase
        .from("appointments")
        .select(`
          *,
          patient:patients(name, email, phone)
        `);

      // If date is provided, filter by that date
      if (formattedDate) {
        query = query.eq("date", formattedDate);
      }

      const { data, error } = await query.order("time");
      
      if (error) throw error;
      return data as Appointment[];
    },
  });

  return {
    appointments: appointments || [],
    isLoading,
    error,
    refetch
  };
}
