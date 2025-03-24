
import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import AppointmentDialog from "./AppointmentDialog";
import { useAppointments } from "@/hooks/use-appointments";
import AppointmentIndicator from "./AppointmentIndicator";

interface MonthlyViewProps {
  date: Date;
  onDateSelect?: (date: Date) => void;
}

const MonthlyView = ({ date, onDateSelect }: MonthlyViewProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
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
  const { appointments } = useAppointments();

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
    setIsDialogOpen(true);
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {format(date, "MMMM 'de' yyyy", { locale: ptBR })}
        </h3>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
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
              {isSameMonth(day, date) && dayAppointments.length > 0 && (
                <div className="text-xs mt-1 space-y-1">
                  {dayAppointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-center space-x-1">
                      <AppointmentIndicator 
                        appointment={appointment} 
                        compact 
                      />
                      <span className="truncate">{appointment.time.substring(0, 5)}</span>
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-blue-500 font-medium">
                      +{dayAppointments.length - 3} mais
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedDay && (
          <AppointmentDialog 
            date={selectedDay} 
            time="08:00" // Default time, could be made more flexible
            onClose={handleCloseDialog} 
          />
        )}
      </Dialog>
    </div>
  );
};

export default MonthlyView;
