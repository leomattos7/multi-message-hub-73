import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Appointment } from "@/hooks/use-appointments";

interface AppointmentIndicatorProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}

const AppointmentIndicator: React.FC<AppointmentIndicatorProps> = ({
  appointment,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={cn(
        "h-full p-2 rounded-md border shadow-sm bg-white hover:shadow-md transition-shadow",
        "group relative cursor-pointer"
      )}
      onClick={() => onEdit(appointment)}
    >
      <div className="text-sm font-medium truncate">
        {appointment.patient_id}
      </div>
      <div className="text-xs text-gray-500">
        {appointment.time} - {appointment.end_time}
      </div>
      {appointment.notes && (
        <div className="text-xs text-gray-500 truncate mt-1">
          {appointment.notes}
        </div>
      )}
      <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(appointment);
          }}
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-red-100 text-red-500 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(appointment.id);
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default AppointmentIndicator;
