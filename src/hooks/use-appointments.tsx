import { useState } from "react";
import { toast } from "sonner";
import { apiService } from "../services/api-service";
import { format, parseISO } from "date-fns";
import { Appointment } from "@/types/appointment";

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAppointments() {
    try {
      setLoading(true);
      const response = await apiService.get<Appointment[]>("/api/appointments");

      const formattedAppointments = response.map((appointment) => ({
        ...appointment,
        date: format(parseISO(appointment.date), "yyyy-MM-dd"),
      }));

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  }

  return {
    appointments,
    loading,
    fetchAppointments,
  };
}
