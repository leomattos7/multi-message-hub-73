
import { useQuery } from "@tanstack/react-query";
import { appointmentService, Appointment } from "@/integrations/supabase/services/appointmentService";

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
