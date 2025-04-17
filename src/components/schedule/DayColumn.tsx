import React from "react";
import { format, isToday, parse } from "date-fns";
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
  onDeleteAppointment,
}: DayColumnProps) => {
  const dateStr = format(day, "yyyy-MM-dd");
  const isCurrentDay = isToday(day);

  // Get all appointments for this day
  const allDayAppointments = Object.values(
    appointmentsByDateAndTime[dateStr] || {}
  ).flat();

  console.log(`Appointments for ${dateStr}:`, allDayAppointments);

  const calculatePosition = (time: string) => {
    // Converte o horário para minutos desde 00:00
    const [hours, minutes] = time.split(":").map(Number);
    return ((hours * 60 + minutes) / 30) * 64;
  };

  return (
    <div className="col-span-1">
      <div
        className={cn(
          "h-10 border-b border-r border-gray-200 px-2 py-1 text-center font-semibold",
          isCurrentDay
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-50 text-gray-700"
        )}
      >
        <div className="text-xs uppercase">
          {format(day, "EEE", { locale: ptBR })}
        </div>
        <div
          className={cn(
            "text-sm leading-none mt-1",
            isCurrentDay && "text-blue-700"
          )}
        >
          {format(day, "dd", { locale: ptBR })}
        </div>
      </div>

      <div className="relative">
        {/* Time slots grid */}
        {timeSlots.map((time) => (
          <div
            key={`${day}-${time}`}
            className={cn(
              "h-16 border-b border-r border-gray-200 hover:bg-blue-50/50 transition-colors cursor-pointer",
              isCurrentDay && "bg-blue-50/30"
            )}
            onClick={() => onCellClick(day, time)}
          />
        ))}

        {/* Render appointments */}
        {!isLoadingAppointments &&
          allDayAppointments.map((appointment) => {
            const startPosition = calculatePosition(
              appointment.time.substring(0, 5)
            );
            const endPosition = calculatePosition(
              appointment.end_time.substring(0, 5)
            );
            const height = endPosition - startPosition;

            console.log(`Event ${appointment.id}:`, {
              time: appointment.time,
              end_time: appointment.end_time,
              startPosition,
              endPosition,
              height,
            });

            return (
              <div
                key={appointment.id}
                className="absolute left-0 right-0 mx-1"
                style={{
                  top: `${startPosition}px`,
                  height: `${height}px`,
                  zIndex: 10,
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
