
import { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, addDays, parseISO, isSameDay, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Save, AlertTriangle, Ban, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { VisualWeeklySchedule } from "@/components/VisualWeeklySchedule";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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

// Days of the week for display
const DAYS_OF_WEEK = [
  { id: 0, name: "Domingo", shortName: "Dom" },
  { id: 1, name: "Segunda-feira", shortName: "Seg" },
  { id: 2, name: "Terça-feira", shortName: "Ter" },
  { id: 3, name: "Quarta-feira", shortName: "Qua" },
  { id: 4, name: "Quinta-feira", shortName: "Qui" },
  { id: 5, name: "Sexta-feira", shortName: "Sex" },
  { id: 6, name: "Sábado", shortName: "Sáb" },
];

// Event types
const EVENT_TYPES = [
  { id: "one-time-block", name: "Bloqueio único" },
  { id: "lunch", name: "Almoço" },
  { id: "meeting", name: "Reunião" },
  { id: "personal", name: "Compromisso Pessoal" },
  { id: "other", name: "Outro" },
];

// Common time slots
const COMMON_TIME_SLOTS = [
  { start: "08:00", end: "12:00", label: "Manhã (8h - 12h)" },
  { start: "12:00", end: "13:00", label: "Almoço (12h - 13h)" },
  { start: "13:00", end: "17:00", label: "Tarde (13h - 17h)" },
  { start: "17:00", end: "21:00", label: "Noite (17h - 21h)" },
  { start: "08:00", end: "17:00", label: "Dia Todo (8h - 17h)" },
];

// Form schema for regular availability
const availabilityFormSchema = z.object({
  day_of_week: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  is_available: z.boolean().default(true),
});

// Form schema for special events
const eventFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  date: z.date(),
  start_time: z.string(),
  end_time: z.string(),
  event_type: z.string(),
});

export default function ScheduleManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("visual");
  const [weeklyAvailability, setWeeklyAvailability] = useState<Availability[]>([]);
  const [specialEvents, setSpecialEvents] = useState<CalendarEvent[]>([]);
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [isAddAvailabilityDialogOpen, setIsAddAvailabilityDialogOpen] = useState(false);
  const [isQuickBlockDialogOpen, setIsQuickBlockDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{start: string, end: string}>({start: "08:00", end: "17:00"});
  const [quickBlockDays, setQuickBlockDays] = useState<number[]>([1, 2, 3, 4, 5]); // Monday to Friday by default
  const [blockType, setBlockType] = useState<'block' | 'unblock'>('block');
  
  // Initialize the doctor ID (in a real app, this would come from authentication)
  const doctorId = "00000000-0000-0000-0000-000000000000"; // Placeholder

  // Forms
  const availabilityForm = useForm<z.infer<typeof availabilityFormSchema>>({
    resolver: zodResolver(availabilityFormSchema),
    defaultValues: {
      day_of_week: "1", // Monday by default
      start_time: "08:00",
      end_time: "17:00",
      is_available: true,
    },
  });

  const eventForm = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      start_time: "08:00",
      end_time: "09:00",
      event_type: "one-time-block",
    },
  });

  // Fetch doctor's weekly availability
  useEffect(() => {
    const fetchWeeklyAvailability = async () => {
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

  // Handle adding new weekly availability
  const handleAddAvailability = async (values: z.infer<typeof availabilityFormSchema>) => {
    try {
      const newAvailability: Availability = {
        doctor_id: doctorId,
        day_of_week: parseInt(values.day_of_week),
        start_time: values.start_time,
        end_time: values.end_time,
        is_available: values.is_available,
      };

      const { data, error } = await supabase
        .from("doctor_availability")
        .insert(newAvailability)
        .select();

      if (error) {
        console.error("Error adding availability:", error);
        toast.error("Erro ao adicionar disponibilidade");
        return;
      }

      if (data) {
        setWeeklyAvailability([...weeklyAvailability, data[0]]);
        toast.success("Disponibilidade adicionada com sucesso");
        setIsAddAvailabilityDialogOpen(false);
        availabilityForm.reset();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao adicionar disponibilidade");
    }
  };

  // Handle deleting weekly availability
  const handleDeleteAvailability = async (id: string) => {
    try {
      const { error } = await supabase
        .from("doctor_availability")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting availability:", error);
        toast.error("Erro ao remover disponibilidade");
        return;
      }

      setWeeklyAvailability(weeklyAvailability.filter(avail => avail.id !== id));
      toast.success("Disponibilidade removida com sucesso");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao remover disponibilidade");
    }
  };

  // Handle adding new special event/block
  const handleAddEvent = async (values: z.infer<typeof eventFormSchema>) => {
    try {
      const newEvent: CalendarEvent = {
        doctor_id: doctorId,
        title: values.title,
        description: values.description || null,
        date: format(values.date, "yyyy-MM-dd"),
        start_time: values.start_time,
        end_time: values.end_time,
        event_type: values.event_type,
      };

      const { data, error } = await supabase
        .from("calendar_events")
        .insert(newEvent)
        .select();

      if (error) {
        console.error("Error adding event:", error);
        toast.error("Erro ao adicionar evento");
        return;
      }

      if (data) {
        setSpecialEvents([...specialEvents, data[0]]);
        toast.success("Evento adicionado com sucesso");
        setIsAddEventDialogOpen(false);
        eventForm.reset();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao adicionar evento");
    }
  };

  // Handle updating weekly availability from visual component
  const handleAvailabilityChange = async (updatedAvailability: Availability[]) => {
    try {
      // Find the new or removed availability by comparing with the current state
      const newAvailability = updatedAvailability.find(
        newAvail => !newAvail.id && !weeklyAvailability.some(
          oldAvail => 
            oldAvail.day_of_week === newAvail.day_of_week && 
            oldAvail.start_time === newAvail.start_time
        )
      );
      
      const removedAvailabilityId = weeklyAvailability.find(
        oldAvail => !updatedAvailability.some(
          newAvail => 
            (newAvail.id && newAvail.id === oldAvail.id) || 
            (newAvail.day_of_week === oldAvail.day_of_week && 
             newAvail.start_time === oldAvail.start_time)
        )
      )?.id;
      
      // Process the change
      if (newAvailability) {
        // Insert the new availability
        const { data, error } = await supabase
          .from("doctor_availability")
          .insert(newAvailability)
          .select();
          
        if (error) {
          console.error("Error updating availability:", error);
          toast.error("Erro ao atualizar disponibilidade");
          return;
        }
        
        if (data) {
          // Update the ID in our state
          const finalUpdatedAvailability = updatedAvailability.map(
            avail => avail === newAvailability ? data[0] : avail
          );
          
          setWeeklyAvailability(finalUpdatedAvailability);
        }
      } else if (removedAvailabilityId) {
        // Delete the removed availability
        const { error } = await supabase
          .from("doctor_availability")
          .delete()
          .eq("id", removedAvailabilityId);
          
        if (error) {
          console.error("Error deleting availability:", error);
          toast.error("Erro ao remover disponibilidade");
          return;
        }
        
        setWeeklyAvailability(updatedAvailability);
      } else {
        // Just update the state
        setWeeklyAvailability(updatedAvailability);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao atualizar disponibilidade");
    }
  };

  // Handle quick block/unblock of multiple days
  const handleQuickBlockUnblock = async () => {
    try {
      // Check if this is a block or unblock operation
      if (blockType === 'block') {
        // Create a batch of entries
        const availabilityEntries = quickBlockDays.map(day => ({
          doctor_id: doctorId,
          day_of_week: day,
          start_time: selectedTimeSlot.start,
          end_time: selectedTimeSlot.end,
          is_available: false, // blocked
        }));

        // Insert all entries
        const { data, error } = await supabase
          .from("doctor_availability")
          .insert(availabilityEntries)
          .select();

        if (error) {
          console.error("Error blocking schedule:", error);
          toast.error("Erro ao bloquear horários");
          return;
        }

        if (data) {
          setWeeklyAvailability([...weeklyAvailability, ...data]);
          toast.success(`${quickBlockDays.length} dias bloqueados com sucesso`);
        }
      } else {
        // For unblock operation, remove all entries that match the criteria
        // Find entries that match the days and time slots
        const entriesToDelete = weeklyAvailability.filter(
          avail => 
            quickBlockDays.includes(avail.day_of_week) && 
            avail.start_time === selectedTimeSlot.start && 
            avail.end_time === selectedTimeSlot.end &&
            !avail.is_available
        );
        
        // Delete each matching entry
        for (const entry of entriesToDelete) {
          if (entry.id) {
            await supabase
              .from("doctor_availability")
              .delete()
              .eq("id", entry.id);
          }
        }
        
        // Update state by removing the deleted entries
        setWeeklyAvailability(weeklyAvailability.filter(
          avail => !entriesToDelete.some(e => e.id === avail.id)
        ));
        
        toast.success(`Horários desbloqueados com sucesso`);
      }
      
      setIsQuickBlockDialogOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Erro ao ${blockType === 'block' ? 'bloquear' : 'desbloquear'} horários`);
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

  // Get the day name from day of week number
  const getDayName = (dayNumber: number) => {
    const day = DAYS_OF_WEEK.find(d => d.id === dayNumber);
    return day ? day.name : "";
  };

  // Get event type name from event type id
  const getEventTypeName = (eventTypeId: string) => {
    const eventType = EVENT_TYPES.find(t => t.id === eventTypeId);
    return eventType ? eventType.name : eventTypeId;
  };

  // Check if a day is blocked in the weekly availability
  const isDayBlocked = (dayNumber: number, startTime: string, endTime: string) => {
    return weeklyAvailability.some(
      avail => 
        avail.day_of_week === dayNumber && 
        avail.start_time === startTime && 
        avail.end_time === endTime && 
        !avail.is_available
    );
  };

  return (
    <div className="container max-w-full mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Gerenciamento de Agenda</h1>

      <Tabs defaultValue="visual" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="visual">Visual Semanal</TabsTrigger>
          <TabsTrigger value="weekly">Horários Detalhados</TabsTrigger>
          <TabsTrigger value="special">Eventos Especiais</TabsTrigger>
        </TabsList>

        {/* Visual Weekly Schedule Tab */}
        <TabsContent value="visual">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento Visual da Agenda</CardTitle>
              <CardDescription>
                Clique nos horários para bloquear ou desbloquear a agenda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VisualWeeklySchedule 
                doctorId={doctorId}
                weeklyAvailability={weeklyAvailability}
                onAvailabilityChange={handleAvailabilityChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weekly Schedule Tab */}
        <TabsContent value="weekly">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Horários Semanais</CardTitle>
                <CardDescription>
                  Configure os horários regulares disponíveis para consultas
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddAvailabilityDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Horário
              </Button>
            </CardHeader>
            <CardContent>
              {weeklyAvailability.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">Sem horários configurados</h3>
                  <p className="mt-2">
                    Adicione horários para que os pacientes possam agendar consultas
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dia da Semana</TableHead>
                      <TableHead>Horário Início</TableHead>
                      <TableHead>Horário Fim</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyAvailability.map((avail) => (
                      <TableRow key={avail.id}>
                        <TableCell className="font-medium">
                          {getDayName(avail.day_of_week)}
                        </TableCell>
                        <TableCell>{avail.start_time}</TableCell>
                        <TableCell>{avail.end_time}</TableCell>
                        <TableCell>
                          {avail.is_available ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Disponível
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              Indisponível
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => avail.id && handleDeleteAvailability(avail.id)}
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

        {/* Special Events Tab */}
        <TabsContent value="special">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Eventos Especiais</CardTitle>
                <CardDescription>
                  Adicione bloqueios ou eventos específicos no calendário
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddEventDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Evento
              </Button>
            </CardHeader>
            <CardContent>
              {specialEvents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">Sem eventos especiais</h3>
                  <p className="mt-2">
                    Adicione bloqueios ou eventos para datas específicas
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specialEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          {event.title}
                        </TableCell>
                        <TableCell>
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
                            onClick={() => event.id && handleDeleteEvent(event.id)}
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

      {/* Dialog for adding new weekly availability */}
      <Dialog open={isAddAvailabilityDialogOpen} onOpenChange={setIsAddAvailabilityDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Horário Semanal</DialogTitle>
          </DialogHeader>
          <Form {...availabilityForm}>
            <form onSubmit={availabilityForm.handleSubmit(handleAddAvailability)} className="space-y-4">
              <FormField
                control={availabilityForm.control}
                name="day_of_week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia da Semana</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o dia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
                          <SelectItem key={day.id} value={day.id.toString()}>
                            {day.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={availabilityForm.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário Início</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={availabilityForm.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário Fim</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={availabilityForm.control}
                name="is_available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Disponível para Agendamentos</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding new special event */}
      <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Evento ou Bloqueio</DialogTitle>
          </DialogHeader>
          <Form {...eventForm}>
            <form onSubmit={eventForm.handleSubmit(handleAddEvent)} className="space-y-4">
              <FormField
                control={eventForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Almoço, Reunião..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={eventForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detalhes adicionais sobre o evento"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={eventForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={eventForm.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora Início</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={eventForm.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora Fim</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={eventForm.control}
                name="event_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Evento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EVENT_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for quick block/unblock */}
      <Dialog open={isQuickBlockDialogOpen} onOpenChange={setIsQuickBlockDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {blockType === 'block' ? 'Bloquear Horários Rapidamente' : 'Desbloquear Horários Rapidamente'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <FormLabel>Selecione os dias da semana</FormLabel>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <Button
                    key={day.id}
                    type="button"
                    variant={quickBlockDays.includes(day.id) ? "default" : "outline"}
                    className="w-[calc(33.33%-0.5rem)]"
                    onClick={() => {
                      if (quickBlockDays.includes(day.id)) {
                        setQuickBlockDays(quickBlockDays.filter(d => d !== day.id));
                      } else {
                        setQuickBlockDays([...quickBlockDays, day.id]);
                      }
                    }}
                  >
                    {day.shortName}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <FormLabel>Selecione o período</FormLabel>
              <div className="flex flex-col space-y-2">
                {COMMON_TIME_SLOTS.map((slot, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={selectedTimeSlot.start === slot.start && selectedTimeSlot.end === slot.end ? "default" : "outline"}
                    className="justify-between"
                    onClick={() => setSelectedTimeSlot({ start: slot.start, end: slot.end })}
                  >
                    <span>{slot.label}</span>
                    <span className="text-xs opacity-70">
                      {slot.start} - {slot.end}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="py-2">
              <p className="text-sm text-muted-foreground mb-2">
                {blockType === 'block' ? 
                  'Esta ação irá bloquear os horários selecionados.' : 
                  'Esta ação irá desbloquear os horários selecionados se estiverem bloqueados.'}
              </p>
              <div className="font-medium">
                Dias selecionados: {quickBlockDays.map(d => DAYS_OF_WEEK.find(day => day.id === d)?.shortName).join(', ')}
              </div>
              <div className="font-medium">
                Horário: {selectedTimeSlot.start} - {selectedTimeSlot.end}
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant={blockType === 'block' ? "block" : "available"} 
                onClick={handleQuickBlockUnblock}
              >
                {blockType === 'block' ? 
                  <><Ban className="mr-2 h-4 w-4" /> Bloquear</> : 
                  <><Check className="mr-2 h-4 w-4" /> Desbloquear</>}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
