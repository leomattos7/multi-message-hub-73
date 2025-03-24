
import React, { useState } from "react";
import { format, addDays, startOfWeek, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import AppointmentDialog from "./AppointmentDialog";
import { useAppointments } from "@/hooks/use-appointments";
import AppointmentIndicator from "./AppointmentIndicator";

interface WeeklyViewProps {
  date: Date;
  onDateSelect?: (date: Date) => void;
}

const WeeklyView = ({ date, onDateSelect }: WeeklyViewProps) => {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  const startDate = startOfWeek(date, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // Time slots from 8:00 to 18:00 (hourly intervals)
  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    timeSlots.push(`${hour}:00`);
  }

  // Get all appointments for the week
  const { appointments } = useAppointments();

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
    setIsNewAppointmentOpen(true);
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  const handleCloseDialog = () => {
    setIsNewAppointmentOpen(false);
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Semana atual</h3>
        <Button onClick={() => setIsNewAppointmentOpen(true)} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>
      
      <div className="grid grid-cols-8 min-w-[800px]">
        {/* Time column */}
        <div className="col-span-1">
          <div className="h-12"></div> {/* Empty header cell */}
          {timeSlots.map((time) => (
            <div key={time} className="h-24 border-b border-r px-2 py-1 flex items-center">
              {time}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          
          return (
            <div key={day.toString()} className="col-span-1">
              <div 
                className={cn(
                  "h-12 border-b border-r px-2 py-1 text-center font-semibold",
                  isToday(day) ? "bg-blue-100" : ""
                )}
              >
                <div>{format(day, "EEE", { locale: ptBR })}</div>
                <div>{format(day, "dd", { locale: ptBR })}</div>
              </div>
              {timeSlots.map((time) => {
                const slotAppointments = appointmentsByDateAndTime[dateStr]?.[time] || [];
                
                return (
                  <div 
                    key={`${day}-${time}`} 
                    className="h-24 border-b border-r hover:bg-blue-50 cursor-pointer relative p-1"
                    onClick={() => handleCellClick(day, time)}
                  >
                    {slotAppointments.length > 0 && (
                      <div className="absolute inset-0 p-1 overflow-y-auto">
                        {slotAppointments.map((appointment) => (
                          <AppointmentIndicator 
                            key={appointment.id} 
                            appointment={appointment}
                          />
                        ))}
                      </div>
                    )}
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
          />
        )}
      </Dialog>
    </div>
  );
};

export default WeeklyView;
