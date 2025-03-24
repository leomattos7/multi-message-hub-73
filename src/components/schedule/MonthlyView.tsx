
import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AppointmentDialog from "./AppointmentDialog";
import { useAppointments, Appointment } from "@/hooks/use-appointments";
import AppointmentIndicator from "./AppointmentIndicator";
import { useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface MonthlyViewProps {
  date: Date;
  onDateSelect?: (date: Date) => void;
}

const MonthlyView = ({ date, onDateSelect }: MonthlyViewProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  
  const daysArray = [];
  let day = startDate;
  
  // Generate array of dates to display in month grid
  while (day <= monthEnd || daysArray.length % 7 !== 0) {
    daysArray.push(day);
    day = addDays(day, 1);
  }

  // Get appointments
  const { appointments, isLoading: isLoadingAppointments } = useAppointments();
  const queryClient = useQueryClient();

  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = [];
    }
    acc[appointment.date].push(appointment);
    return acc;
  }, {} as Record<string, typeof appointments>);

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setSelectedAppointment(null);
    setIsDialogOpen(true);
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    // Find the date for this appointment
    const appointmentDate = new Date(appointment.date);
    setSelectedDay(appointmentDate);
    setSelectedAppointment(appointment);
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

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {format(date, "MMMM 'de' yyyy", { locale: ptBR })}
        </h3>
        <Button onClick={() => {
          setSelectedDay(new Date());
          setSelectedAppointment(null);
          setIsDialogOpen(true);
        }} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((weekday) => (
          <div key={weekday} className="text-center font-medium p-2">
            {weekday}
          </div>
        ))}
        
        {/* Calendar days */}
        {daysArray.map((day, idx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayAppointments = appointmentsByDate[dateStr] || [];
          
          return (
            <div
              key={idx}
              className={cn(
                "h-24 p-1 border rounded-md overflow-hidden",
                !isSameMonth(day, date) ? "bg-gray-100 text-gray-400" : "",
                isToday(day) ? "bg-blue-50 border-blue-300" : "",
                "hover:bg-blue-50 cursor-pointer"
              )}
              onClick={() => handleDayClick(day)}
            >
              <div className="text-right p-1">{format(day, 'd')}</div>
              {isSameMonth(day, date) && (
                isLoadingAppointments ? (
                  <div className="text-xs text-gray-400">Carregando...</div>
                ) : dayAppointments.length > 0 && (
                  <div className="text-xs mt-1 space-y-1">
                    {dayAppointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-center space-x-1 group relative">
                        <AppointmentIndicator 
                          appointment={appointment} 
                          compact 
                        />
                        <span className="truncate">{appointment.time.substring(0, 5)} - {appointment.patient?.name}</span>
                        
                        <div className="hidden group-hover:flex items-center gap-1 absolute right-0">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAppointment(appointment);
                            }}
                          >
                            <span className="sr-only">Editar</span>
                            <Edit className="h-2 w-2" />
                          </Button>
                          {appointment.status !== "cancelado" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4 text-red-500" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(appointment.id);
                              }}
                            >
                              <span className="sr-only">Cancelar</span>
                              <Trash2 className="h-2 w-2" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-blue-500 font-medium">
                        +{dayAppointments.length - 3} mais
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedDay && (
          <AppointmentDialog 
            date={selectedDay} 
            time="08:00" // Default time for monthly view
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

export default MonthlyView;
