
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
  
  // Helper function to calculate appointment height and position
  const getAppointmentSpan = (appointment: Appointment) => {
    const startTime = appointment.time.substring(0, 5); // HH:MM format
    const endTime = appointment.end_time?.substring(0, 5);
    
    if (!endTime) return { startSlot: timeSlots.indexOf(startTime), spanCount: 1 };
    
    const startIndex = timeSlots.indexOf(startTime);
    const endIndex = timeSlots.indexOf(endTime);
    
    // If end time is not found in slots (likely after the last slot)
    // or if start time is not found, return default span
    if (startIndex === -1) return { startSlot: 0, spanCount: 1 };
    if (endIndex === -1) {
      // For appointments that end after the last time slot,
      // span until the end of available slots
      return { startSlot: startIndex, spanCount: timeSlots.length - startIndex };
    }
    
    return { 
      startSlot: startIndex, 
      spanCount: Math.max(1, endIndex - startIndex) 
    };
  };
  
  // First, collect all appointments for this day
  const allDayAppointments = Object.values(appointmentsByDateAndTime[dateStr] || {})
    .flat()
    .map(appointment => ({
      ...appointment,
      ...getAppointmentSpan(appointment)
    }));
  
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
      
      {timeSlots.map((time, index) => {
        // Get appointments that start at this time slot
        const slotAppointments = allDayAppointments.filter(apt => apt.startSlot === index);
        
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
                  <div 
                    key={appointment.id}
                    className={cn(
                      "absolute left-0 right-0 mx-1",
                      `h-[${appointment.spanCount * 16}px]`
                    )}
                    style={{ 
                      height: `${appointment.spanCount * 16}px`,
                      zIndex: 10
                    }}
                  >
                    <AppointmentIndicator 
                      appointment={appointment}
                      onEdit={onEditAppointment}
                      onDelete={onDeleteAppointment}
                    />
                  </div>
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
