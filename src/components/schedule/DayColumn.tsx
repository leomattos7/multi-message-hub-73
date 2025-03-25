
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
      
      <div className="relative">
        {timeSlots.map((time, index) => (
          <div 
            key={`${day}-${time}`} 
            className={cn(
              "h-16 border-b border-r border-gray-200 hover:bg-blue-50/50 transition-colors cursor-pointer",
              isCurrentDay && "bg-blue-50/30"
            )}
            onClick={() => onCellClick(day, time)}
          >
            {/* Empty cell content */}
          </div>
        ))}

        {/* Render appointments as absolute positioned elements */}
        {!isLoadingAppointments && allDayAppointments.map((appointment) => {
          const slotHeight = 16; // height of each time slot in pixels
          const top = appointment.startSlot * slotHeight;
          const height = appointment.spanCount * slotHeight;
          
          return (
            <div 
              key={appointment.id}
              className="absolute left-0 right-0 mx-1"
              style={{ 
                top: `${top}px`,
                height: `${height}px`,
                zIndex: 10
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <AppointmentIndicator 
                appointment={appointment}
                onEdit={onEditAppointment}
                onDelete={onDeleteAppointment}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayColumn;
