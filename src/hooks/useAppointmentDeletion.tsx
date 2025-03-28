
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelado" })
        .eq("id", appointmentToDelete);

      if (error) {
        toast.error("Erro ao cancelar consulta");
        console.error("Error canceling appointment:", error);
      } else {
        toast.success("Consulta cancelada com sucesso");
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
      }
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
