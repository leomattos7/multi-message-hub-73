
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
      return { 
        icon: CheckCircle2, 
        color: 'bg-green-100 text-green-600 border-green-200',
        gradient: 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
      };
    case 'cancelado':
      return { 
        icon: XCircle, 
        color: 'bg-red-100 text-red-600 border-red-200',
        gradient: 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
      };
    case 'aguardando':
      return { 
        icon: Clock, 
        color: 'bg-yellow-100 text-yellow-600 border-yellow-200',
        gradient: 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
      };
    default:
      return { 
        icon: AlertCircle, 
        color: 'bg-blue-100 text-blue-600 border-blue-200',
        gradient: 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
      };
  }
};

const AppointmentIndicator = ({ appointment, compact = false, onEdit, onDelete }: AppointmentIndicatorProps) => {
  const { icon: StatusIcon, color, gradient } = getStatusDetails(appointment.status);
  
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("h-3 w-3 rounded-full shadow-sm border border-white", 
              appointment.status === 'confirmado' ? "bg-green-500" : 
              appointment.status === 'cancelado' ? "bg-red-500" : 
              "bg-yellow-500"
            )} />
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-white/95 backdrop-blur-sm border shadow-lg rounded-lg p-2">
            <p className="font-medium">{appointment.time} - {appointment.patient?.name}</p>
            <div className="flex items-center gap-1 mt-1">
              <StatusIcon className="h-3 w-3" />
              <p className="text-xs capitalize">{appointment.status}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div 
      className={cn(
        "px-2 py-1.5 rounded-lg text-xs border shadow-sm transition-all duration-200 mb-1 group relative",
        gradient, 
        appointment.status === 'cancelado' ? "opacity-70" : "hover:shadow-md"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center space-x-2">
        <StatusIcon className="h-3.5 w-3.5 flex-shrink-0" />
        <div className="flex-1 overflow-hidden">
          <div className="font-medium truncate">{appointment.patient?.name}</div>
          <div className="text-[10px] flex items-center gap-1">
            <span className="font-medium">{appointment.time}</span> 
            <span className="opacity-60">•</span> 
            <span>{appointment.type}</span>
          </div>
        </div>
        
        {appointment.status !== 'cancelado' && (onEdit || onDelete) && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full hover:bg-white/50" 
                onClick={() => onEdit(appointment)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full hover:bg-white/50 text-red-500 hover:text-red-600" 
                onClick={() => onDelete(appointment.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentIndicator;
