
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Plus, Trash2, AlertTriangle, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VisualWeeklySchedule } from "@/components/VisualWeeklySchedule";
import { supabase } from "@/integrations/supabase/client";
import { TimeBlock } from "@/components/DateTimeBlockSelector";

// Type for doctor availability
type Availability = {
  id?: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

// Type for special event/block
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

// Event types
const EVENT_TYPES = [
  { id: "one-time-block", name: "Bloqueio único" },
  { id: "lunch", name: "Almoço" },
  { id: "meeting", name: "Reunião" },
  { id: "personal", name: "Compromisso Pessoal" },
  { id: "other", name: "Outro" },
];

export default function ScheduleManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("availability");
  const [weeklyAvailability, setWeeklyAvailability] = useState<Availability[]>([]);
  const [specialEvents, setSpecialEvents] = useState<CalendarEvent[]>([]);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize the doctor ID (in a real app, this would come from authentication)
  const doctorId = "00000000-0000-0000-0000-000000000000"; // Placeholder

  // Fetch doctor's weekly availability
  useEffect(() => {
    const fetchWeeklyAvailability = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("doctor_availability")
          .select("*")
          .eq("doctor_id", doctorId);

        if (error) {
          console.error("Error fetching availability:", error);
          toast.error("Erro ao carregar disponibilidade");
          return;
        }

        if (data) {
          setWeeklyAvailability(data);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Erro ao carregar disponibilidade");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyAvailability();
  }, [doctorId]);

  // Fetch special events
  useEffect(() => {
    const fetchSpecialEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("calendar_events")
          .select("*")
          .eq("doctor_id", doctorId);

        if (error) {
          console.error("Error fetching events:", error);
          toast.error("Erro ao carregar eventos");
          return;
        }

        if (data) {
          setSpecialEvents(data);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Erro ao carregar eventos");
      }
    };

    fetchSpecialEvents();
  }, [doctorId]);

  // Handle updating weekly availability
  const handleAvailabilityChange = async (updatedAvailability: Availability[]) => {
    // This function is now handled directly in the VisualWeeklySchedule component
    // We just need to update our local state
    setWeeklyAvailability(updatedAvailability);
  };

  // Handle special events changes
  const handleSpecialEventsChange = async (updatedEvents: CalendarEvent[]) => {
    try {
      console.log("Handling special events change:", updatedEvents);
      
      // Find entries that need to be added to the database (those without an ID)
      const newEntries = updatedEvents.filter(event => !event.id);
      
      // Find entries that need to be removed (in current state but not in updated state)
      const removedEntries = specialEvents.filter(
        oldEvent => !updatedEvents.some(
          newEvent => newEvent.id === oldEvent.id
        )
      );
      
      // Insert new entries
      if (newEntries.length > 0) {
        const { data: insertedData, error: insertError } = await supabase
          .from("calendar_events")
          .insert(newEntries)
          .select();
          
        if (insertError) {
          console.error("Error inserting events:", insertError);
          toast.error("Erro ao adicionar eventos");
          return;
        }
        
        // Update the events with their new IDs
        const finalEvents = updatedEvents.map(
          event => {
            if (newEntries.includes(event) && insertedData) {
              const inserted = insertedData.find(
                ins => ins.date === event.date && 
                       ins.start_time === event.start_time &&
                       ins.end_time === event.end_time
              );
              return inserted || event;
            }
            return event;
          }
        );
        
        setSpecialEvents(finalEvents);
        toast.success("Eventos atualizados com sucesso");
      } else {
        setSpecialEvents(updatedEvents);
      }
      
      // Delete removed entries
      for (const entry of removedEntries) {
        if (entry.id) {
          const { error: deleteError } = await supabase
            .from("calendar_events")
            .delete()
            .eq("id", entry.id);
            
          if (deleteError) {
            console.error("Error deleting event:", deleteError);
            toast.error("Erro ao remover evento");
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error updating events:", error);
      toast.error("Erro ao atualizar eventos");
    }
  };

  // Handle deleting special event
  const handleDeleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting event:", error);
        toast.error("Erro ao remover evento");
        return;
      }

      setSpecialEvents(specialEvents.filter(event => event.id !== id));
      toast.success("Evento removido com sucesso");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao remover evento");
    }
  };

  // Get event type name from event type id
  const getEventTypeName = (eventTypeId: string) => {
    const eventType = EVENT_TYPES.find(t => t.id === eventTypeId);
    return eventType ? eventType.name : eventTypeId;
  };

  // View event details
  const viewEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  return (
    <div className="container max-w-full mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Gerenciamento de Agenda</h1>

      <Tabs defaultValue="availability" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="availability">Disponibilidade Semanal</TabsTrigger>
          <TabsTrigger value="blocks">Bloqueios de Agenda</TabsTrigger>
        </TabsList>

        {/* Weekly Availability Tab */}
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Horários de Atendimento</CardTitle>
              <CardDescription>
                Configure quais dias e horários você está disponível para atendimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Carregando disponibilidade...</p>
                </div>
              ) : (
                <VisualWeeklySchedule 
                  doctorId={doctorId}
                  weeklyAvailability={weeklyAvailability}
                  onAvailabilityChange={handleAvailabilityChange}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Special Events List Tab */}
        <TabsContent value="blocks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Bloqueios de Agenda</CardTitle>
                <CardDescription>
                  Lista de todos os bloqueios cadastrados na agenda
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {specialEvents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">Sem bloqueios cadastrados</h3>
                  <p className="mt-2">
                    Adicione bloqueios para indisponibilizar determinadas datas e horários
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specialEvents.map((event) => (
                      <TableRow key={event.id} className="cursor-pointer" onClick={() => viewEventDetails(event)}>
                        <TableCell className="font-medium">
                          {format(parseISO(event.date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>
                          {event.start_time} - {event.end_time}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {getEventTypeName(event.event_type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              event.id && handleDeleteEvent(event.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Event Details Dialog */}
      <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Bloqueio</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Data</p>
                  <p className="text-lg">
                    {format(parseISO(selectedEvent.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Horário</p>
                  <p className="text-lg">
                    {selectedEvent.start_time} - {selectedEvent.end_time}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-500">Tipo</p>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mt-1">
                  {getEventTypeName(selectedEvent.event_type)}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-500">Título</p>
                <p className="text-lg">{selectedEvent.title}</p>
              </div>
              
              {selectedEvent.description && (
                <div>
                  <p className="text-sm font-semibold text-gray-500">Descrição</p>
                  <p className="text-lg">{selectedEvent.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="destructive" 
              onClick={() => {
                selectedEvent?.id && handleDeleteEvent(selectedEvent.id);
                setIsEventDetailsOpen(false);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
