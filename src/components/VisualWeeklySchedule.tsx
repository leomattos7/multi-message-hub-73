
import React, { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

// Type for doctor availability
type Availability = {
  id?: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

// Props for the component
interface VisualWeeklyScheduleProps {
  doctorId: string;
  weeklyAvailability: Availability[];
  onAvailabilityChange: (availability: Availability[]) => void;
}

// Generate time slots from 8:00 to 21:00
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 8; i <= 21; i++) {
    slots.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return slots;
};

// Format time slot for display
const formatTimeSlot = (time: string) => {
  return time.substring(0, 5);
};

export function VisualWeeklySchedule({
  doctorId,
  weeklyAvailability,
  onAvailabilityChange,
}: VisualWeeklyScheduleProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  
  // Generate days of the week
  const startDay = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start on Monday
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startDay, i);
    return {
      date: day,
      dayOfWeek: i === 6 ? 0 : i + 1, // Convert to day of week (0 = Sunday, 1 = Monday, etc.)
      name: format(day, "EEE", { locale: ptBR }),
      fullName: format(day, "EEEE", { locale: ptBR })
    };
  });
  
  // Generate time slots
  const timeSlots = generateTimeSlots();
  
  // Check if a time slot is available or blocked for a specific day
  const getTimeSlotStatus = (dayOfWeek: number, timeSlot: string): 'available' | 'blocked' | 'undefined' => {
    const slot = weeklyAvailability.find(
      avail => 
        avail.day_of_week === dayOfWeek && 
        avail.start_time === timeSlot
    );
    
    if (!slot) return 'undefined';
    return slot.is_available ? 'available' : 'blocked';
  };
  
  // Handle cell click to toggle status
  const handleCellClick = (dayOfWeek: number, timeSlot: string) => {
    const currentStatus = getTimeSlotStatus(dayOfWeek, timeSlot);
    let updatedAvailability = [...weeklyAvailability];
    
    // Find existing entry for this time slot if it exists
    const existingEntryIndex = updatedAvailability.findIndex(
      avail => 
        avail.day_of_week === dayOfWeek && 
        avail.start_time === timeSlot
    );
    
    // Toggle status logic
    let newStatus: boolean;
    
    if (currentStatus === 'available') {
      // If available, make it blocked
      newStatus = false;
    } else {
      // If blocked or undefined, make it available
      newStatus = true;
    }
    
    if (existingEntryIndex >= 0) {
      // Update existing entry
      updatedAvailability[existingEntryIndex] = {
        ...updatedAvailability[existingEntryIndex],
        is_available: newStatus
      };
    } else {
      // Add new entry
      const newAvailability: Availability = {
        doctor_id: doctorId,
        day_of_week: dayOfWeek,
        start_time: timeSlot,
        end_time: timeSlot.replace("00", "59"), // End at XX:59
        is_available: newStatus,
      };
      
      updatedAvailability = [...updatedAvailability, newAvailability];
    }
    
    onAvailabilityChange(updatedAvailability);
    
    toast.success(
      newStatus 
        ? `Horário de ${timeSlot} ${daysOfWeek.find(d => d.dayOfWeek === dayOfWeek)?.fullName} disponibilizado`
        : `Horário de ${timeSlot} ${daysOfWeek.find(d => d.dayOfWeek === dayOfWeek)?.fullName} bloqueado`
    );
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-[1px] bg-gray-200 border border-gray-200 rounded-lg">
            {/* Header row with days of the week */}
            <div className="bg-white p-2 font-semibold flex items-center justify-center">Horário</div>
            {daysOfWeek.map((day) => (
              <div 
                key={day.dayOfWeek} 
                className={cn(
                  "bg-white p-2 font-semibold text-center",
                  day.dayOfWeek === 0 || day.dayOfWeek === 6 ? "bg-gray-50" : ""
                )}
              >
                {day.name}
              </div>
            ))}
            
            {/* Time slots */}
            {timeSlots.map((timeSlot) => (
              <React.Fragment key={timeSlot}>
                <div className="bg-white p-2 text-center border-t border-gray-100 flex items-center justify-center">
                  {formatTimeSlot(timeSlot)}
                </div>
                
                {daysOfWeek.map((day) => {
                  const status = getTimeSlotStatus(day.dayOfWeek, timeSlot);
                  const cellId = `${day.dayOfWeek}-${timeSlot}`;
                  
                  return (
                    <TooltipProvider key={cellId}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={cn(
                              "border-t border-gray-100 cursor-pointer transition-colors h-12 flex items-center justify-center",
                              status === 'blocked' ? "bg-red-500" : "",
                              status === 'available' ? "bg-green-500" : "",
                              status === 'undefined' ? "bg-white" : "",
                              day.dayOfWeek === 0 || day.dayOfWeek === 6 ? "bg-opacity-80" : "",
                              hoveredCell === cellId ? "opacity-80" : "",
                            )}
                            onClick={() => handleCellClick(day.dayOfWeek, timeSlot)}
                            onMouseEnter={() => setHoveredCell(cellId)}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            {status === 'blocked' && <Lock className="h-4 w-4 text-white" />}
                            {status === 'available' && <Check className="h-4 w-4 text-white" />}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {status === 'blocked' 
                              ? `${day.fullName} ${timeSlot} - Bloqueado` 
                              : status === 'available'
                                ? `${day.fullName} ${timeSlot} - Disponível`
                                : `${day.fullName} ${timeSlot} - Clique para definir`}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Clique para alternar entre disponível (verde) e bloqueado (vermelho)</p>
      </div>
    </div>
  );
}
