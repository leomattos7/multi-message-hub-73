
import React, { useState, useEffect } from "react";
import { format, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { DateTimeBlockSelector, TimeBlock } from "@/components/DateTimeBlockSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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

// Type for calendar event (special blocks)
type CalendarEvent = {
  id?: string;
  doctor_id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  event_type: string;
};

// Props for the component
interface VisualWeeklyScheduleProps {
  doctorId: string;
  weeklyAvailability: Availability[];
  specialEvents?: CalendarEvent[];
  onAvailabilityChange: (availability: Availability[]) => void;
  onSpecialEventsChange?: (events: CalendarEvent[]) => void;
}

export function VisualWeeklySchedule({
  doctorId,
  weeklyAvailability,
  specialEvents = [],
  onAvailabilityChange,
  onSpecialEventsChange
}: VisualWeeklyScheduleProps) {
  const [activeTab, setActiveTab] = useState<string>("blocks");
  const [blockAvailability, setBlockAvailability] = useState<TimeBlock[]>([]);
  
  // Convert special events to time blocks for display
  useEffect(() => {
    if (specialEvents.length > 0) {
      const blocks = specialEvents.map(event => ({
        id: event.id,
        date: parseISO(event.date),
        startTime: event.start_time,
        endTime: event.end_time
      }));
      setBlockAvailability(blocks);
    }
  }, [specialEvents]);
  
  // Handle changes to time blocks
  const handleBlocksChange = (blocks: TimeBlock[]) => {
    setBlockAvailability(blocks);
    
    if (onSpecialEventsChange) {
      // Convert time blocks to calendar events
      const events = blocks.map(block => ({
        id: block.id,
        doctor_id: doctorId,
        title: "Bloqueio de agenda",
        description: null,
        date: format(block.date, "yyyy-MM-dd"),
        start_time: block.startTime,
        end_time: block.endTime,
        event_type: "one-time-block"
      }));
      
      onSpecialEventsChange(events);
    }
  };
  
  // Handle saving changes
  const handleSaveChanges = () => {
    // Implementation depends on how you want to handle saving
    toast.success("Alterações salvas com sucesso");
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="blocks" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="blocks">Bloqueios de Agenda</TabsTrigger>
          <TabsTrigger value="weekly">Visão Semanal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blocks">
          <Card>
            <CardHeader>
              <CardTitle>Bloqueios de Agenda</CardTitle>
              <CardDescription>
                Adicione datas e horários para bloquear sua agenda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DateTimeBlockSelector 
                blocks={blockAvailability}
                onChange={handleBlocksChange}
              />
              
              <div className="mt-6">
                <Button onClick={handleSaveChanges}>
                  Salvar alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Visão Semanal da Agenda</CardTitle>
              <CardDescription>
                Esta visualização mostra os padrões semanais de disponibilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">Funcionalidade em desenvolvimento</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Utilize a aba "Bloqueios de Agenda" para gerenciar sua disponibilidade no estilo Google Calendar
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
