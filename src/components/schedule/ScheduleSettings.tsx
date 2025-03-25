import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  CalendarClock, 
  ListChecks, 
  Clock,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generateAllTimeSlots } from "@/utils/timeSlotUtils";

interface ConsultationType {
  id?: string;
  name: string;
  duration: number;
  doctor_id: string;
}

interface WeeklyTimeSlot {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
}

const ScheduleSettings = () => {
  const [activeTab, setActiveTab] = useState<string>("availability");
  const [blockedTimes, setBlockedTimes] = useState<any[]>([]);
  const [weeklyAvailability, setWeeklyAvailability] = useState<WeeklyTimeSlot[]>([]);
  const [consultationTypes, setConsultationTypes] = useState<ConsultationType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newTypeName, setNewTypeName] = useState<string>("");
  const [newTypeDuration, setNewTypeDuration] = useState<number>(30);

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("17:00");

  const doctorId = "00000000-0000-0000-0000-000000000000";

  const TIME_SLOTS = generateAllTimeSlots();

  useEffect(() => {
    fetchConsultationTypes();
    fetchWeeklyAvailability();
  }, []);

  const fetchConsultationTypes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('consultation_types')
        .select('*')
        .eq('doctor_id', doctorId);

      if (error) {
        console.error("Error fetching consultation types:", error);
        toast.error("Erro ao carregar tipos de consulta");
      } else if (data) {
        setConsultationTypes(data);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao carregar tipos de consulta");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeeklyAvailability = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('doctor_availability')
        .select('*')
        .eq('doctor_id', doctorId);

      if (error) {
        console.error("Error fetching weekly availability:", error);
        toast.error("Erro ao carregar disponibilidade semanal");
      } else if (data) {
        const transformedData = data.map(slot => ({
          id: slot.id,
          day: slot.day_of_week,
          startTime: slot.start_time,
          endTime: slot.end_time
        }));
        setWeeklyAvailability(transformedData);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao carregar disponibilidade semanal");
    } finally {
      setIsLoading(false);
    }
  };

  const addConsultationType = async () => {
    if (!newTypeName.trim()) {
      toast.error("Nome da consulta é obrigatório");
      return;
    }

    if (newTypeDuration <= 0) {
      toast.error("Duração deve ser maior que zero");
      return;
    }

    setIsLoading(true);
    try {
      const newType = {
        name: newTypeName.trim(),
        duration: newTypeDuration,
        doctor_id: doctorId
      };

      const { data, error } = await supabase
        .from('consultation_types')
        .insert(newType)
        .select();

      if (error) {
        console.error("Error adding consultation type:", error);
        toast.error("Erro ao adicionar tipo de consulta");
      } else if (data) {
        setConsultationTypes([...consultationTypes, data[0]]);
        setNewTypeName("");
        setNewTypeDuration(30);
        toast.success("Tipo de consulta adicionado com sucesso");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao adicionar tipo de consulta");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConsultationType = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('consultation_types')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting consultation type:", error);
        toast.error("Erro ao excluir tipo de consulta");
      } else {
        setConsultationTypes(consultationTypes.filter(type => type.id !== id));
        toast.success("Tipo de consulta excluído com sucesso");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao excluir tipo de consulta");
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="mt-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="availability" className="flex items-center gap-1.5">
            <CalendarClock className="h-4 w-4" />
            <span>Disponibilidade</span>
          </TabsTrigger>
          <TabsTrigger value="blocked" className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>Bloqueios</span>
          </TabsTrigger>
          <TabsTrigger value="types" className="flex items-center gap-1.5">
            <ListChecks className="h-4 w-4" />
            <span>Tipos</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Horários Disponíveis</CardTitle>
              <CardDescription>
                Configure os dias e horários em que você está disponível para atendimentos.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                          {TIME_SLOTS.map(time => (
                            <SelectItem key={`start-${time}`} value={time}>{time}</SelectItem>
                          ))}
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
                          {TIME_SLOTS.map(time => (
                            <SelectItem key={`end-${time}`} value={time}>{time}</SelectItem>
                          ))}
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
              </div>
              
              <div className="text-sm text-gray-500 mt-6">
                (GMT-03:00) Horário Padrão de Brasília - São Paulo
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blocked" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bloqueios de Agenda</CardTitle>
              <CardDescription>
                Configure datas e horários que você deseja bloquear na sua agenda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500 border rounded-md">
                <Clock className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>Funcionalidade de bloqueios em desenvolvimento</p>
                <p className="text-sm mt-1">Em breve você poderá adicionar bloqueios específicos à sua agenda</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Consulta</CardTitle>
              <CardDescription>
                Configure os tipos de consulta que você oferece e suas durações.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <Label htmlFor="type-name">Nome do tipo de consulta</Label>
                    <Input
                      id="type-name"
                      placeholder="Ex: Consulta de rotina"
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                    />
                  </div>
                  <div className="col-span-4">
                    <Label htmlFor="type-duration">Duração (minutos)</Label>
                    <Input
                      id="type-duration"
                      type="number"
                      placeholder="30"
                      min={5}
                      value={newTypeDuration}
                      onChange={(e) => setNewTypeDuration(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2 flex items-end">
                    <Button 
                      onClick={addConsultationType} 
                      disabled={isLoading}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>
                
                {isLoading && consultationTypes.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    Carregando tipos de consulta...
                  </div>
                ) : consultationTypes.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 border rounded-md">
                    <ListChecks className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>Nenhum tipo de consulta configurado</p>
                    <p className="text-sm mt-1">Adicione tipos de consulta para que apareçam nas opções de agendamento</p>
                  </div>
                ) : (
                  <div className="space-y-2 mt-4">
                    {consultationTypes.map((type) => (
                      <div key={type.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
                        <div>
                          <p className="font-medium">{type.name}</p>
                          <p className="text-sm text-gray-500">{type.duration} minutos</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => type.id && deleteConsultationType(type.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleSettings;
