
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Plus, X, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generateAllTimeSlots } from "@/utils/timeSlotUtils";

interface WeeklyTimeSlot {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
}

interface AvailabilityTabProps {
  doctorId: string;
  weeklyAvailability: WeeklyTimeSlot[];
  setWeeklyAvailability: React.Dispatch<React.SetStateAction<WeeklyTimeSlot[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AvailabilityTab: React.FC<AvailabilityTabProps> = ({
  doctorId,
  weeklyAvailability,
  setWeeklyAvailability,
  isLoading,
  setIsLoading
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("17:00");

  const TIME_SLOTS = generateAllTimeSlots();

  const addWeeklyAvailability = async () => {
    if (startTime >= endTime) {
      toast.error("O horário inicial deve ser anterior ao horário final");
      return;
    }

    const hasOverlap = weeklyAvailability.some(slot => 
      slot.day === selectedDay &&
      ((startTime >= slot.startTime && startTime < slot.endTime) ||
       (endTime > slot.startTime && endTime <= slot.endTime) ||
       (startTime <= slot.startTime && endTime >= slot.endTime))
    );

    if (hasOverlap) {
      toast.error("Este horário se sobrepõe a um já existente para este dia");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('doctor_availability')
        .insert({
          doctor_id: doctorId,
          day_of_week: selectedDay,
          start_time: startTime,
          end_time: endTime,
          is_available: true
        })
        .select();
      
      if (error) {
        console.error("Error adding weekly availability:", error);
        toast.error("Erro ao adicionar disponibilidade");
        return;
      }
      
      if (data && data.length > 0) {
        const newSlot = {
          id: data[0].id,
          day: data[0].day_of_week,
          startTime: data[0].start_time,
          endTime: data[0].end_time
        };
        
        setWeeklyAvailability([...weeklyAvailability, newSlot]);
        toast.success("Disponibilidade adicionada com sucesso");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao adicionar disponibilidade");
    } finally {
      setIsLoading(false);
    }
  };

  const removeWeeklyAvailability = async (id: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('doctor_availability')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error removing weekly availability:", error);
        toast.error("Erro ao remover disponibilidade");
        return;
      }
      
      setWeeklyAvailability(weeklyAvailability.filter(slot => slot.id !== id));
      toast.success("Disponibilidade removida com sucesso");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao remover disponibilidade");
    } finally {
      setIsLoading(false);
    }
  };

  const getDayName = (day: number): string => {
    const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return days[day];
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Adicionar novo horário disponível</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="day-select">Dia da semana</Label>
            <Select 
              value={selectedDay.toString()} 
              onValueChange={(value) => setSelectedDay(parseInt(value))}
            >
              <SelectTrigger id="day-select">
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
            <Label htmlFor="start-time">Horário inicial</Label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger id="start-time">
                <SelectValue placeholder="Início" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <ScrollArea className="h-[200px]">
                  {TIME_SLOTS.map(time => (
                    <SelectItem key={`start-${time}`} value={time}>{time}</SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="end-time">Horário final</Label>
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger id="end-time">
                <SelectValue placeholder="Fim" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <ScrollArea className="h-[200px]">
                  {TIME_SLOTS.map(time => (
                    <SelectItem key={`end-${time}`} value={time}>{time}</SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={addWeeklyAvailability} 
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar disponibilidade
        </Button>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Horários semanais configurados</h3>
        
        {isLoading && weeklyAvailability.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Carregando disponibilidade...
          </div>
        ) : weeklyAvailability.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border rounded-md">
            <Clock className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>Nenhum horário de disponibilidade configurado</p>
            <p className="text-sm mt-1">Adicione horários para que os pacientes possam agendar consultas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[0, 1, 2, 3, 4, 5, 6].map(day => {
              const daySlots = weeklyAvailability.filter(slot => slot.day === day);
              if (daySlots.length === 0) return null;
              
              return (
                <div key={day} className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">{getDayName(day)}</h4>
                  <div className="space-y-2">
                    {daySlots.map((slot) => (
                      <div 
                        key={slot.id} 
                        className="flex justify-between items-center bg-green-50 p-3 rounded-md border border-green-100"
                      >
                        <span className="font-medium text-green-800">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeWeeklyAvailability(slot.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
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
      
      <div className="text-sm text-gray-500 mt-6">
        (GMT-03:00) Horário Padrão de Brasília - São Paulo
      </div>
    </div>
  );
};

export default AvailabilityTab;
