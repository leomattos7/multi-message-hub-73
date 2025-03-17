
import React, { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Lock, Check, Calendar } from "lucide-react";
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

  // Find a specific availability entry
  const findAvailabilityEntry = (dayOfWeek: number, timeSlot: string) => {
    return weeklyAvailability.find(
      avail => avail.day_of_week === dayOfWeek && avail.start_time === timeSlot
    );
  };

  // Helper function to check if a time slot is available or blocked
  const getSlotStatus = (dayOfWeek: number, timeSlot: string): 'available' | 'blocked' | 'undefined' => {
    const entry = findAvailabilityEntry(dayOfWeek, timeSlot);
    if (!entry) return 'undefined';
    return entry.is_available ? 'available' : 'blocked';
  };
  
  // Handle click on a cell to toggle availability
  const handleCellClick = (dayOfWeek: number, timeSlot: string) => {
    // Create a deep copy of the current availability
    const updatedAvailability = [...weeklyAvailability];
    
    // Find the existing entry if it exists
    const existingEntry = findAvailabilityEntry(dayOfWeek, timeSlot);
    const currentStatus = getSlotStatus(dayOfWeek, timeSlot);
    
    // Determine the new availability status (toggle current status)
    const newIsAvailable = currentStatus !== 'available';
    
    // If entry exists, update it; otherwise create a new one
    if (existingEntry) {
      const updatedEntry = {
        ...existingEntry,
        is_available: newIsAvailable
      };
      
      // Find the index and update
      const index = updatedAvailability.findIndex(
        avail => avail.id === existingEntry.id
      );
      
      if (index >= 0) {
        updatedAvailability[index] = updatedEntry;
      }
    } else {
      // Create a new entry
      updatedAvailability.push({
        doctor_id: doctorId,
        day_of_week: dayOfWeek,
        start_time: timeSlot,
        end_time: timeSlot.replace(":00", ":59"), // End at XX:59
        is_available: newIsAvailable
      });
    }
    
    // Apply changes
    onAvailabilityChange(updatedAvailability);
    
    // Show notification
    const dayName = daysOfWeek.find(d => d.dayOfWeek === dayOfWeek)?.fullName || '';
    if (newIsAvailable) {
      toast.success(`Horário ${timeSlot} de ${dayName} disponibilizado`);
    } else {
      toast.success(`Horário ${timeSlot} de ${dayName} bloqueado`);
    }
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-[1px] bg-gray-200 border border-gray-200 rounded-lg shadow-sm">
            {/* Header row with days of the week */}
            <div className="bg-white p-2 font-semibold flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-2" />
              Horário
            </div>
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
                  {timeSlot}
                </div>
                
                {daysOfWeek.map((day) => {
                  const status = getSlotStatus(day.dayOfWeek, timeSlot);
                  const cellId = `${day.dayOfWeek}-${timeSlot}`;
                  
                  return (
                    <TooltipProvider key={cellId}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={cn(
                              "border-t border-gray-100 cursor-pointer transition-colors h-12 flex items-center justify-center",
                              status === 'blocked' ? "bg-red-500 hover:bg-red-600" : "",
                              status === 'available' ? "bg-green-500 hover:bg-green-600" : "",
                              status === 'undefined' ? "bg-white hover:bg-gray-100" : "",
                              day.dayOfWeek === 0 || day.dayOfWeek === 6 ? "bg-opacity-90" : "",
                              hoveredCell === cellId ? "ring-2 ring-offset-1 ring-blue-400" : "",
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
      
      <div className="flex mt-4 gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
          <span>Disponível</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
          <span>Bloqueado</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white border border-gray-200 rounded-sm mr-2"></div>
          <span>Não definido (clique para configurar)</span>
        </div>
      </div>
    </div>
  );
}
