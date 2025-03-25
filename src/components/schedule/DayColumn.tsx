
import React from "react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Appointment } from "@/hooks/use-appointments";
import AppointmentIndicator from "./AppointmentIndicator";

interface DayColumnProps {
  day: Date;
  timeSlots: string[];
  appointmentsByDateAndTime: Record<string, Record<string, Appointment[]>>;
  isLoadingAppointments: boolean;
  onCellClick: (day: Date, time: string) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

const DayColumn = ({
  day,
  timeSlots,
  appointmentsByDateAndTime,
  isLoadingAppointments,
  onCellClick,
  onEditAppointment,
  onDeleteAppointment
}: DayColumnProps) => {
  const dateStr = format(day, 'yyyy-MM-dd');
  const isCurrentDay = isToday(day);
  
  return (
    <div className="col-span-1">
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
            onClick={() => onCellClick(day, time)}
          >
            {isLoadingAppointments ? (
              <div className="text-xs text-gray-400 animate-pulse">Carregando...</div>
            ) : slotAppointments.length > 0 ? (
              <div className="absolute inset-0 p-1 overflow-y-auto">
                {slotAppointments.map((appointment) => (
                  <AppointmentIndicator 
                    key={appointment.id} 
                    appointment={appointment}
                    onEdit={onEditAppointment}
                    onDelete={onDeleteAppointment}
                  />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default DayColumn;
