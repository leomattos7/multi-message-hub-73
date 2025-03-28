
import React, { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { generateAllTimeSlots } from "@/utils/timeSlotUtils";

export type Availability = {
  id?: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

interface VisualWeeklyScheduleProps {
  doctorId: string;
  weeklyAvailability: Availability[];
  onAvailabilityChange: (availability: Availability[]) => void;
}

const getDayName = (day: number): string => {
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  return days[day];
};

// Get all possible time slots from 00:00 to 23:30
const TIME_SLOTS = generateAllTimeSlots();

export function VisualWeeklySchedule({
  doctorId,
  weeklyAvailability,
  onAvailabilityChange
}: VisualWeeklyScheduleProps) {
  const [availability, setAvailability] = useState<Availability[]>(weeklyAvailability);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setAvailability(weeklyAvailability);
  }, [weeklyAvailability]);

  // Check if a time slot with the same day and start time already exists
  const checkDuplicateTimeSlot = (day: number, start: string): boolean => {
    return availability.some(
      slot => slot.day_of_week === day && 
              slot.start_time === start
    );
  };

  const handleAddAvailability = async () => {
    if (startTime >= endTime) {
      toast.error("O horário final deve ser após o horário inicial");
      return;
    }
    
    // Check for duplicate time slot
    if (checkDuplicateTimeSlot(selectedDay, startTime)) {
      toast.error("Já existe um horário configurado para este dia e hora inicial");
      return;
    }
    
    const overlapping = availability.some(
      slot => slot.day_of_week === selectedDay && 
              slot.is_available &&
              ((startTime >= slot.start_time && startTime < slot.end_time) ||
               (endTime > slot.start_time && endTime <= slot.end_time) ||
               (startTime <= slot.start_time && endTime >= slot.end_time))
    );
    
    if (overlapping) {
      toast.error("Esse horário se sobrepõe a um horário já existente");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create new slot in the database
      const newSlot: Availability = {
        doctor_id: doctorId,
        day_of_week: selectedDay,
        start_time: startTime,
        end_time: endTime,
        is_available: true
      };
      
      const { data, error } = await supabase
        .from('doctor_availability')
        .insert(newSlot)
        .select();
      
      if (error) {
        console.error("Error adding availability:", error);
        
        // Provide more specific error messages based on error code
        if (error.code === "23505") {
          toast.error("Este horário já está cadastrado para este dia");
        } else {
          toast.error("Erro ao adicionar disponibilidade: " + error.message);
        }
        return;
      }
      
      if (data && data.length > 0) {
        // Transform DB response to ensure it matches our Availability type
        const transformedData = data.map(item => ({
          ...item,
          is_available: true // Ensure is_available is set
        })) as Availability[];
        
        // Update state with the inserted record (now with an ID)
        const updatedAvailability = [...availability, ...transformedData];
        setAvailability(updatedAvailability);
        onAvailabilityChange(updatedAvailability);
        
        toast.success("Disponibilidade adicionada com sucesso");
      }
    } catch (error) {
      console.error("Error adding availability:", error);
      toast.error("Erro ao adicionar disponibilidade");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAvailability = async (index: number) => {
    setIsLoading(true);
    
    try {
      const removedItem = availability[index];
      let updatedAvailability: Availability[];
      
      if (removedItem.id) {
        // For items with an ID, remove from the database
        const { error } = await supabase
          .from('doctor_availability')
          .delete()
          .eq('id', removedItem.id);
        
        if (error) {
          console.error("Error removing availability:", error);
          toast.error("Erro ao remover disponibilidade");
          return;
        }
        
        // Remove from state
        updatedAvailability = availability.filter((_, i) => i !== index);
      } else {
        // For items without an ID (not yet saved), just remove locally
        updatedAvailability = [...availability];
        updatedAvailability.splice(index, 1);
      }
      
      setAvailability(updatedAvailability);
      onAvailabilityChange(updatedAvailability);
      toast.success("Disponibilidade removida");
    } catch (error) {
      console.error("Error removing availability:", error);
      toast.error("Erro ao remover disponibilidade");
    } finally {
      setIsLoading(false);
    }
  };

  const availableSlots = availability.filter(slot => slot.is_available);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Adicionar novo horário disponível</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <Select value={selectedDay.toString()} onValueChange={(value) => setSelectedDay(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Segunda-feira</SelectItem>
                <SelectItem value="2">Terça-feira</SelectItem>
                <SelectItem value="3">Quarta-feira</SelectItem>
                <SelectItem value="4">Quinta-feira</SelectItem>
                <SelectItem value="5">Sexta-feira</SelectItem>
                <SelectItem value="6">Sábado</SelectItem>
                <SelectItem value="0">Domingo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger>
                <SelectValue placeholder="Horário inicial" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {TIME_SLOTS.map((time) => (
                  <SelectItem key={`start-${time}`} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger>
                <SelectValue placeholder="Horário final" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {TIME_SLOTS.map((time) => (
                  <SelectItem key={`end-${time}`} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleAddAvailability} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Adicionando...' : 'Adicionar disponibilidade'}
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Horários configurados</h3>
        
        {availableSlots.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border rounded-md">
            <Clock className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>Nenhum horário de disponibilidade configurado</p>
            <p className="text-sm mt-1">Adicione horários para que os pacientes possam agendar consultas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[0, 1, 2, 3, 4, 5, 6].map(day => {
              const daySlots = availableSlots.filter(slot => slot.day_of_week === day);
              if (daySlots.length === 0) return null;
              
              return (
                <div key={day} className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">{getDayName(day)}</h4>
                  <div className="space-y-2">
                    {daySlots.map((slot, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-green-50 p-2 rounded-md border border-green-100">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                            Disponível
                          </Badge>
                          <span>{slot.start_time} - {slot.end_time}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveAvailability(availability.indexOf(slot))}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Removendo...' : 'Remover'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
