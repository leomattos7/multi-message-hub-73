import React, { useState, useEffect } from "react";
import { format, parseISO, isSameDay, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, ChevronsUpDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Availability = {
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

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

export function VisualWeeklySchedule({
  doctorId,
  weeklyAvailability,
  onAvailabilityChange
}: VisualWeeklyScheduleProps) {
  const [activeTab, setActiveTab] = useState<string>("weekly");
  const [availability, setAvailability] = useState<Availability[]>(weeklyAvailability);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  
  useEffect(() => {
    setAvailability(weeklyAvailability);
  }, [weeklyAvailability]);

  const handleAddAvailability = () => {
    if (startTime >= endTime) {
      toast.error("O horário final deve ser após o horário inicial");
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
    
    const newSlot: Availability = {
      doctor_id: doctorId,
      day_of_week: selectedDay,
      start_time: startTime,
      end_time: endTime,
      is_available: true
    };
    
    const updatedAvailability = [...availability, newSlot];
    setAvailability(updatedAvailability);
    onAvailabilityChange(updatedAvailability);
    
    toast.success("Disponibilidade adicionada com sucesso");
  };

  const handleRemoveAvailability = (index: number) => {
    const updatedAvailability = [...availability];
    const removedItem = updatedAvailability[index];
    
    if (removedItem.id) {
      updatedAvailability[index] = {
        ...removedItem,
        is_available: false
      };
    } else {
      updatedAvailability.splice(index, 1);
    }
    
    setAvailability(updatedAvailability);
    onAvailabilityChange(updatedAvailability);
    toast.success("Disponibilidade removida");
  };

  const availableSlots = availability.filter(slot => slot.is_available);

  const slotsByDay = availableSlots.reduce((acc, slot) => {
    const day = slot.day_of_week;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(slot);
    return acc;
  }, {} as Record<number, Availability[]>);

  const generateWeekPreview = () => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 });

    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(startOfCurrentWeek, i);
      const dayOfWeek = day.getDay();
      const daySlots = slotsByDay[dayOfWeek] || [];
      
      return (
        <div key={i} className="border rounded-md p-4 bg-white">
          <div className="font-medium mb-2">
            {format(day, "EEEE", { locale: ptBR })}
            <span className="text-gray-400 ml-2">
              {format(day, "dd/MM")}
            </span>
          </div>
          
          {daySlots.length === 0 ? (
            <div className="text-gray-400 text-sm py-2">Nenhum horário disponível</div>
          ) : (
            <div className="space-y-1">
              {daySlots.map((slot, idx) => (
                <div key={idx} className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3 text-green-500" />
                  <span>{slot.start_time} - {slot.end_time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="weekly">Horários Disponíveis</TabsTrigger>
          <TabsTrigger value="preview">Visualização da Semana</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Horários de Atendimento</CardTitle>
              <CardDescription>
                Configure os horários em que você está disponível para atendimento
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                        <SelectContent>
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
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={`end-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button onClick={handleAddAvailability} className="w-full">
                      Adicionar disponibilidade
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
                                  >
                                    Remover
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Visualização da Semana</CardTitle>
              <CardDescription>
                Veja como sua agenda ficará para os próximos dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                {generateWeekPreview()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
