
import React from "react";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle, AlertCircle, Edit, Trash2 } from "lucide-react";
import { Appointment } from "@/hooks/use-appointments";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface AppointmentIndicatorProps {
  appointment: Appointment;
  compact?: boolean;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointmentId: string) => void;
}

export const getStatusDetails = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'confirmado':
      return { icon: CheckCircle2, color: 'bg-green-100 text-green-600 border-green-200' };
    case 'cancelado':
      return { icon: XCircle, color: 'bg-red-100 text-red-600 border-red-200' };
    case 'aguardando':
      return { icon: Clock, color: 'bg-yellow-100 text-yellow-600 border-yellow-200' };
    default:
      return { icon: AlertCircle, color: 'bg-blue-100 text-blue-600 border-blue-200' };
  }
};

const AppointmentIndicator = ({ appointment, compact = false, onEdit, onDelete }: AppointmentIndicatorProps) => {
  const { icon: StatusIcon, color } = getStatusDetails(appointment.status);
  
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("h-2 w-2 rounded-full", 
              appointment.status === 'confirmado' ? "bg-green-500" : 
              appointment.status === 'cancelado' ? "bg-red-500" : 
              "bg-yellow-500"
            )} />
          </TooltipTrigger>
          <TooltipContent>
            <p>{appointment.time} - {appointment.patient?.name}</p>
            <p className="text-xs">{appointment.status}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div 
      className={cn("px-2 py-1 rounded-md text-sm border flex items-center space-x-2 mb-1 group relative", color)}
      onClick={(e) => e.stopPropagation()}
    >
      <StatusIcon className="h-4 w-4" />
      <div className="flex-1 overflow-hidden">
        <div className="font-medium truncate">{appointment.patient?.name}</div>
        <div className="text-xs">{appointment.time} - {appointment.type}</div>
      </div>
      
      {appointment.status !== 'cancelado' && (onEdit || onDelete) && (
        <div className="hidden group-hover:flex items-center gap-1">
          {onEdit && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => onEdit(appointment)}
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-red-500 hover:text-red-700" 
              onClick={() => onDelete(appointment.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentIndicator;
