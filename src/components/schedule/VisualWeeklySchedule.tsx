
import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import { TimeBlock } from "@/components/DateTimeBlockSelector";
import { supabase } from "@/integrations/supabase/client";

type WeeklyAvailability = {
  id?: string;
  doctor_id: string;
  day_of_week: number; // 0-6 for Sunday-Saturday
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  is_available: boolean;
};

interface VisualWeeklyScheduleProps {
  doctorId: string;
  weeklyAvailability: WeeklyAvailability[];
  onAvailabilityChange: (availability: WeeklyAvailability[]) => void;
}

const getDayName = (day: number): string => {
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  return days[day];
};

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

export const VisualWeeklySchedule = ({ 
  doctorId, 
  weeklyAvailability,
  onAvailabilityChange
}: VisualWeeklyScheduleProps) => {
  const [availability, setAvailability] = useState<WeeklyAvailability[]>(weeklyAvailability);
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default to Monday
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("09:00");
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
      // Create new availability slot
      const newSlot: WeeklyAvailability = {
        doctor_id: doctorId,
        day_of_week: selectedDay,
        start_time: startTime,
        end_time: endTime,
        is_available: true
      };
      
      // Save to Supabase if in a real application
      const { data, error } = await supabase
        .from('doctor_availability')
        .insert(newSlot)
        .select();
      
      if (error) {
        console.error("Error adding availability:", error);
        toast.error("Erro ao adicionar disponibilidade: " + error.message);
        return;
      }
      
      if (data && data.length > 0) {
        // Update state with the inserted record (now with an ID)
        const updatedAvailability = [...availability, data[0]];
        setAvailability(updatedAvailability);
        
        if (onAvailabilityChange) {
          onAvailabilityChange(updatedAvailability);
        }
        
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
      const slotToRemove = availability[index];
      
      if (slotToRemove.id) {
        // Delete from Supabase
        const { error } = await supabase
          .from('doctor_availability')
          .delete()
          .eq('id', slotToRemove.id);
        
        if (error) {
          console.error("Error removing availability:", error);
          toast.error("Erro ao remover disponibilidade");
          return;
        }
      }
      
      // Update state
      const updatedAvailability = [...availability];
      updatedAvailability.splice(index, 1);
      setAvailability(updatedAvailability);
      
      if (onAvailabilityChange) {
        onAvailabilityChange(updatedAvailability);
      }
      
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
    <div>
      <div className="mb-8">
        <Button 
          onClick={handleAddAvailability}
          className="w-full bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 font-medium"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar disponibilidade
        </Button>
      
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Select value={selectedDay.toString()} onValueChange={(value) => setSelectedDay(parseInt(value))}>
              <SelectTrigger className="w-full">
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
          
          <div className="flex items-center gap-2">
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Horário inicial" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((time) => (
                  <SelectItem key={`start-${time}`} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <span className="text-gray-500">até</span>
            
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Horário final" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((time) => (
                  <SelectItem key={`end-${time}`} value={time} disabled={time <= startTime}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div>
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
};
