
import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useAppointments } from "@/hooks/use-appointments";
import AppointmentDialog from "./AppointmentDialog";
import AppointmentIndicator from "./AppointmentIndicator";
import { generateTimeSlots } from "@/utils/timeSlotUtils";
import { useAppointmentDeletion } from "@/hooks/useAppointmentDeletion";
import DeleteAppointmentDialog from "./DeleteAppointmentDialog";

interface DailyViewProps {
  date: Date;
}

const DailyView = ({ date }: DailyViewProps) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  
  const { appointments, isLoading: isLoadingAppointments } = useAppointments(date);
  const { 
    deleteDialogOpen, 
    isLoading: isDeleting,
    handleDeleteClick, 
    confirmDelete, 
    setDeleteDialogOpen 
  } = useAppointmentDeletion();
  
  // Use useMemo to generate time slots based on appointments
  const timeSlots = useMemo(() => {
    return generateTimeSlots(appointments);
  }, [appointments]);

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

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setSelectedSlot(null);
    setIsDialogOpen(true);
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
                <div className="flex justify-between items-center p-2">
                  <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors">{time}</span>
                  <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                    <Plus className="h-4 w-4 mr-1" />
                    Agendar
                  </Button>
                </div>
                
                {slotAppointments.length > 0 ? (
                  <div className="px-3 pb-2 space-y-1">
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
                  <div className="px-3 pb-2 text-gray-400 text-xs italic">Nenhuma consulta agendada</div>
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

      <DeleteAppointmentDialog
        isOpen={deleteDialogOpen}
        isLoading={isDeleting}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default DailyView;
