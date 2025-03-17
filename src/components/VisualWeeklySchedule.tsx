
import React, { useState, useEffect } from "react";
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
  const [localAvailability, setLocalAvailability] = useState<Availability[]>([]);
  
  // Initialize local availability state with all slots available by default
  useEffect(() => {
    // Use the database entries but default to all available
    setLocalAvailability(weeklyAvailability);
  }, [weeklyAvailability]);
  
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

  // Find a specific availability entry that indicates a blocked slot
  const findBlockedSlot = (dayOfWeek: number, timeSlot: string) => {
    return localAvailability.find(
      avail => avail.day_of_week === dayOfWeek && 
              avail.start_time === timeSlot && 
              !avail.is_available
    );
  };

  // Check if a time slot is blocked (default is available/green)
  const isSlotBlocked = (dayOfWeek: number, timeSlot: string): boolean => {
    const entry = findBlockedSlot(dayOfWeek, timeSlot);
    return !!entry; // If an entry exists and is not available, it's blocked
  };
  
  // Handle click on a cell to toggle availability
  const handleCellClick = (dayOfWeek: number, timeSlot: string) => {
    // Check if it's currently blocked
    const isCurrentlyBlocked = isSlotBlocked(dayOfWeek, timeSlot);
    
    // Create a deep copy of the current availability
    const updatedAvailability = [...localAvailability];
    
    // Find existing entry if it exists (only for blocked entries, as available is the default)
    const existingEntry = findBlockedSlot(dayOfWeek, timeSlot);
    
    if (isCurrentlyBlocked && existingEntry) {
      // If currently blocked and exists in DB, remove it from our local state
      // This will make it available (green) by default
      const filteredAvailability = updatedAvailability.filter(avail => 
        !(avail.day_of_week === dayOfWeek && 
          avail.start_time === timeSlot && 
          !avail.is_available)
      );
      
      setLocalAvailability(filteredAvailability);
      onAvailabilityChange(filteredAvailability);
    } else if (!isCurrentlyBlocked) {
      // If it's currently available (green), add a blocked entry
      const newEntry: Availability = {
        doctor_id: doctorId,
        day_of_week: dayOfWeek,
        start_time: timeSlot,
        end_time: timeSlot.replace(":00", ":59"), // End at XX:59
        is_available: false // Mark as blocked
      };
      
      updatedAvailability.push(newEntry);
      setLocalAvailability(updatedAvailability);
      onAvailabilityChange(updatedAvailability);
    }
    
    // Show notification
    const dayName = daysOfWeek.find(d => d.dayOfWeek === dayOfWeek)?.fullName || '';
    if (isCurrentlyBlocked) {
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
                  const isBlocked = isSlotBlocked(day.dayOfWeek, timeSlot);
                  const cellId = `${day.dayOfWeek}-${timeSlot}`;
                  
                  return (
                    <TooltipProvider key={cellId}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={cn(
                              "border-t border-gray-100 cursor-pointer transition-colors h-12 flex items-center justify-center",
                              isBlocked 
                                ? "bg-red-500 hover:bg-red-600" 
                                : "bg-green-500 hover:bg-green-600", // Default is green (available)
                              day.dayOfWeek === 0 || day.dayOfWeek === 6 ? "bg-opacity-90" : "",
                              hoveredCell === cellId ? "ring-2 ring-offset-1 ring-blue-400" : "",
                            )}
                            onClick={() => handleCellClick(day.dayOfWeek, timeSlot)}
                            onMouseEnter={() => setHoveredCell(cellId)}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            {isBlocked 
                              ? <Lock className="h-4 w-4 text-white" /> 
                              : <Check className="h-4 w-4 text-white" />
                            }
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {isBlocked 
                              ? `${day.fullName} ${timeSlot} - Bloqueado` 
                              : `${day.fullName} ${timeSlot} - Disponível`
                            }
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
      </div>
    </div>
  );
}
