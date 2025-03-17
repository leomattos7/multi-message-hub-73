
import React, { useState, useEffect } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  const [selectedStatus, setSelectedStatus] = useState<"block" | "unblock">("block");
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
  
  // Check if a time slot is blocked for a specific day
  const isTimeSlotBlocked = (dayOfWeek: number, timeSlot: string) => {
    return weeklyAvailability.some(
      avail => 
        avail.day_of_week === dayOfWeek && 
        avail.start_time === timeSlot && 
        !avail.is_available
    );
  };
  
  // Handle cell click to toggle blocked status
  const handleCellClick = (dayOfWeek: number, timeSlot: string) => {
    const isCurrentlyBlocked = isTimeSlotBlocked(dayOfWeek, timeSlot);
    
    // If we're in block mode and it's already blocked, or in unblock mode and it's not blocked, do nothing
    if ((selectedStatus === "block" && isCurrentlyBlocked) || 
        (selectedStatus === "unblock" && !isCurrentlyBlocked)) {
      return;
    }
    
    let updatedAvailability = [...weeklyAvailability];
    
    if (selectedStatus === "block") {
      // Add a new blocked availability
      const newAvailability: Availability = {
        doctor_id: doctorId,
        day_of_week: dayOfWeek,
        start_time: timeSlot,
        end_time: timeSlot.replace("00", "59"), // End at XX:59
        is_available: false,
      };
      updatedAvailability = [...updatedAvailability, newAvailability];
    } else {
      // Remove the blocked availability
      updatedAvailability = updatedAvailability.filter(
        avail => 
          !(avail.day_of_week === dayOfWeek && 
            avail.start_time === timeSlot && 
            !avail.is_available)
      );
    }
    
    onAvailabilityChange(updatedAvailability);
    
    toast.success(
      selectedStatus === "block" 
        ? `Horário de ${timeSlot} ${daysOfWeek.find(d => d.dayOfWeek === dayOfWeek)?.fullName} bloqueado`
        : `Horário de ${timeSlot} ${daysOfWeek.find(d => d.dayOfWeek === dayOfWeek)?.fullName} desbloqueado`
    );
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-4 mb-4">
        <Button
          variant={selectedStatus === "block" ? "destructive" : "outline"}
          onClick={() => setSelectedStatus("block")}
          className="flex gap-2 items-center"
        >
          <Lock className="h-4 w-4" />
          Bloquear
        </Button>
        <Button
          variant={selectedStatus === "unblock" ? "default" : "outline"}
          onClick={() => setSelectedStatus("unblock")}
          className="flex gap-2 items-center bg-green-600 text-white hover:bg-green-700"
        >
          <Unlock className="h-4 w-4" />
          Desbloquear
        </Button>
      </div>

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
                  const isBlocked = isTimeSlotBlocked(day.dayOfWeek, timeSlot);
                  const cellId = `${day.dayOfWeek}-${timeSlot}`;
                  
                  return (
                    <TooltipProvider key={cellId}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={cn(
                              "border-t border-gray-100 cursor-pointer transition-colors",
                              isBlocked ? "bg-red-100" : "bg-white",
                              day.dayOfWeek === 0 || day.dayOfWeek === 6 ? "bg-opacity-80" : "",
                              hoveredCell === cellId && selectedStatus === "block" && !isBlocked ? "bg-red-50" : "",
                              hoveredCell === cellId && selectedStatus === "unblock" && isBlocked ? "bg-green-50" : "",
                            )}
                            onClick={() => handleCellClick(day.dayOfWeek, timeSlot)}
                            onMouseEnter={() => setHoveredCell(cellId)}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <div className="h-12 flex items-center justify-center">
                              {isBlocked && <Lock className="h-4 w-4 text-red-500" />}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {isBlocked 
                              ? `${day.fullName} ${timeSlot} - Bloqueado` 
                              : `${day.fullName} ${timeSlot} - Disponível`}
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
        <p>
          {selectedStatus === "block" 
            ? "Clique nos horários para bloquear"
            : "Clique nos horários bloqueados para desbloquear"}
        </p>
      </div>
    </div>
  );
}
