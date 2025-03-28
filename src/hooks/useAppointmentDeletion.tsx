
import { useState } from "react";
import { toast } from "sonner";
import { appointmentService } from "@/integrations/supabase/services/appointmentService";
import { useQueryClient } from "@tanstack/react-query";

export function useAppointmentDeletion() {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleDeleteClick = (appointmentId: string) => {
    setAppointmentToDelete(appointmentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!appointmentToDelete) return;
    
    setIsLoading(true);
    try {
      await appointmentService.cancelAppointment(appointmentToDelete);
      toast.success("Consulta cancelada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("Erro ao cancelar consulta");
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setAppointmentToDelete(null);
    }
  };

  return {
    isLoading,
    deleteDialogOpen,
    appointmentToDelete,
    handleDeleteClick,
    confirmDelete,
    setDeleteDialogOpen
  };
}
