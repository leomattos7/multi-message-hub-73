
import React, { useState } from "react";
import { format, addDays, startOfWeek, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AppointmentDialog from "./AppointmentDialog";
import { useAppointments, Appointment } from "@/hooks/use-appointments";
import AppointmentIndicator from "./AppointmentIndicator";
import { useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface WeeklyViewProps {
  date: Date;
  onDateSelect?: (date: Date) => void;
}

const WeeklyView = ({ date, onDateSelect }: WeeklyViewProps) => {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const startDate = startOfWeek(date, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // Time slots from 8:00 to 18:00 (hourly intervals)
  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    timeSlots.push(`${hour}:00`);
  }

  // Get all appointments for the week
  const { appointments, isLoading: isLoadingAppointments } = useAppointments();
  const queryClient = useQueryClient();

  // Group appointments by date and time
  const appointmentsByDateAndTime = appointments.reduce((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = {};
    }
    
    const time = appointment.time.substring(0, 5); // Get just the hour:minute part
    if (!acc[appointment.date][time]) {
      acc[appointment.date][time] = [];
    }
    
    acc[appointment.date][time].push(appointment);
    return acc;
  }, {} as Record<string, Record<string, typeof appointments>>);

  const handleCellClick = (day: Date, time: string) => {
    setSelectedDay(day);
    setSelectedTime(time);
    setSelectedAppointment(null);
    setIsNewAppointmentOpen(true);
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  const handleCloseDialog = () => {
    setIsNewAppointmentOpen(false);
    setSelectedAppointment(null);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    // Find the date for this appointment
    const appointmentDate = new Date(appointment.date);
    setSelectedDay(appointmentDate);
    setSelectedAppointment(appointment);
    setSelectedTime(null);
    setIsNewAppointmentOpen(true);
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

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Semana atual</h3>
        <Button 
          onClick={() => {
            setSelectedDay(new Date());
            setSelectedTime("08:00");
            setSelectedAppointment(null);
            setIsNewAppointmentOpen(true);
          }} 
          size="sm"
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="mr-1 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>
      
      <div className="grid grid-cols-8 min-w-[800px] rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
        {/* Time column */}
        <div className="col-span-1 bg-gray-50">
          <div className="h-10 border-b border-r border-gray-200 flex items-center justify-center font-semibold text-gray-500 text-sm">
            Horário
          </div>
          {timeSlots.map((time) => (
            <div key={time} className="h-16 border-b border-r border-gray-200 px-2 py-1 flex items-center justify-center text-gray-700">
              {time}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCurrentDay = isToday(day);
          
          return (
            <div key={day.toString()} className="col-span-1">
              <div 
                className={cn(
                  "h-10 border-b border-r border-gray-200 px-2 py-1 text-center font-semibold",
                  isCurrentDay ? "bg-blue-100 text-blue-800" : "bg-gray-50 text-gray-700"
                )}
              >
                <div className="text-xs uppercase">{format(day, "EEE", { locale: ptBR })}</div>
                <div className={cn(
                  "text-sm leading-none mt-1",
                  isCurrentDay && "text-blue-700"
                )}>
                  {format(day, "dd", { locale: ptBR })}
                </div>
              </div>
              
              {timeSlots.map((time) => {
                const slotAppointments = appointmentsByDateAndTime[dateStr]?.[time] || [];
                
                return (
                  <div 
                    key={`${day}-${time}`} 
                    className={cn(
                      "h-16 border-b border-r border-gray-200 hover:bg-blue-50/50 transition-colors cursor-pointer relative p-1",
                      isCurrentDay && "bg-blue-50/30"
                    )}
                    onClick={() => handleCellClick(day, time)}
                  >
                    {isLoadingAppointments ? (
                      <div className="text-xs text-gray-400 animate-pulse">Carregando...</div>
                    ) : slotAppointments.length > 0 ? (
                      <div className="absolute inset-0 p-1 overflow-y-auto">
                        {slotAppointments.map((appointment) => (
                          <AppointmentIndicator 
                            key={appointment.id} 
                            appointment={appointment}
                            onEdit={handleEditAppointment}
                            onDelete={handleDeleteClick}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Dialog for new appointment */}
      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        {selectedDay && (
          <AppointmentDialog 
            date={selectedDay} 
            time={selectedTime} 
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

export default WeeklyView;
