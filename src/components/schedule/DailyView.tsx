
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AppointmentDialog from "./AppointmentDialog";
import { useAppointments, Appointment } from "@/hooks/use-appointments";
import AppointmentIndicator from "./AppointmentIndicator";
import { useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Helper function to generate time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 18; hour++) {
    slots.push(`${hour}:00`);
  }
  return slots;
};

interface DailyViewProps {
  date: Date;
}

const DailyView = ({ date }: DailyViewProps) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const timeSlots = generateTimeSlots();
  const { appointments, isLoading: isLoadingAppointments } = useAppointments(date);
  const queryClient = useQueryClient();

  const handleSlotClick = (time: string) => {
    setSelectedSlot(time);
    setSelectedAppointment(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSlot(null);
    setSelectedAppointment(null);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedSlot(null);
    setIsDialogOpen(true);
  };

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

  // Group appointments by time
  const appointmentsByTime = appointments.reduce((acc, appointment) => {
    const time = appointment.time.substring(0, 5); // Get just the hour:minute part
    if (!acc[time]) {
      acc[time] = [];
    }
    acc[time].push(appointment);
    return acc;
  }, {} as Record<string, typeof appointments>);

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </h3>
        <Button onClick={() => handleSlotClick("08:00")} size="sm" className="bg-blue-500 hover:bg-blue-600">
          <Plus className="mr-1 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        {isLoadingAppointments ? (
          <div className="p-4 text-center text-gray-500 animate-pulse">Carregando agendamentos...</div>
        ) : (
          timeSlots.map((time) => {
            const slotAppointments = appointmentsByTime[time] || [];
            return (
              <div 
                key={time} 
                className="border-b last:border-b-0 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                onClick={() => handleSlotClick(time)}
              >
                <div className="flex justify-between items-center p-3">
                  <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors">{time}</span>
                  <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                    <Plus className="h-4 w-4 mr-1" />
                    Agendar
                  </Button>
                </div>
                
                {slotAppointments.length > 0 ? (
                  <div className="px-3 pb-3 space-y-1">
                    {slotAppointments.map((appointment) => (
                      <AppointmentIndicator 
                        key={appointment.id} 
                        appointment={appointment}
                        onEdit={handleEditAppointment}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="px-3 pb-3 text-gray-400 text-sm italic">Nenhuma consulta agendada</div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {(selectedSlot || selectedAppointment) && (
          <AppointmentDialog 
            date={date} 
            time={selectedSlot} 
            onClose={handleCloseDialog}
            appointment={selectedAppointment || undefined}
          />
        )}
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Consulta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta consulta? Esta ação irá marcar a consulta como cancelada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Não, manter agendamento</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {isLoading ? "Cancelando..." : "Sim, cancelar consulta"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DailyView;
