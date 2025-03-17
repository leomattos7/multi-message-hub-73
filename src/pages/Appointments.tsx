
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, addDays, startOfDay, isBefore, isToday, parseISO, isWithinInterval, parse } from "date-fns";
import { Calendar as CalendarIcon, Clock, Check, ArrowLeft, User } from "lucide-react";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

// Available times for appointments
const AVAILABLE_TIMES = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

// Types of appointments
const APPOINTMENT_TYPES = [
  { id: "routine", name: "Consulta de Rotina" },
  { id: "followup", name: "Retorno" },
  { id: "emergency", name: "Urgência" },
  { id: "exam", name: "Resultado de Exame" }
];

// Payment methods
const PAYMENT_METHODS = [
  { id: "insurance", name: "Plano de Saúde" },
  { id: "private", name: "Particular" }
];

// Define form schema with zod
const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  date: z.date({ required_error: "Selecione uma data para a consulta" }),
  time: z.string({ required_error: "Selecione um horário" }),
  type: z.string({ required_error: "Selecione o tipo de atendimento" }),
  paymentMethod: z.string({ required_error: "Selecione o método de pagamento" }),
  notes: z.string().optional(),
});

// Doctor profile schema
const doctorProfileSchema = z.object({
  name: z.string(),
  specialty: z.string(),
  bio: z.string(),
  photo: z.string().optional(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
});

type FormValues = z.infer<typeof formSchema>;
type DoctorProfile = z.infer<typeof doctorProfileSchema>;

// Type for doctor availability
type Availability = {
  id: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

// Type for special event/block
type CalendarEvent = {
  id: string;
  doctor_id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  event_type: string;
};

// Initial doctor profile (same as in SecretaryDashboard)
const initialDoctorProfile: DoctorProfile = {
  name: "Dra. Ana Silva",
  specialty: "Clínico Geral",
  bio: "Médica com mais de 10 anos de experiência em clínica geral, especializada em saúde preventiva e bem-estar.",
  photo: "https://randomuser.me/api/portraits/women/68.jpg",
  address: "Av. Paulista, 1000, São Paulo - SP",
  phone: "(11) 95555-5555",
  email: "dra.anasilva@clinica.com.br",
};

export default function Appointments() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"calendar" | "time" | "form">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>(initialDoctorProfile);
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  const [doctorAvailability, setDoctorAvailability] = useState<Availability[]>([]);
  const [specialEvents, setSpecialEvents] = useState<CalendarEvent[]>([]);
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the doctor ID (in a real app, this would come from authentication)
  const doctorId = "00000000-0000-0000-0000-000000000000"; // Placeholder
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      paymentMethod: "",
      notes: "",
    },
  });

  // Fetch doctor profile from local storage if available
  useEffect(() => {
    const storedProfile = localStorage.getItem('doctorProfile');
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        setDoctorProfile(parsedProfile);
      } catch (error) {
        console.error("Error parsing doctor profile:", error);
      }
    }
  }, []);

  // Fetch doctor's availability
  useEffect(() => {
    const fetchDoctorAvailability = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("doctor_availability")
          .select("*")
          .eq("doctor_id", doctorId)
          .eq("is_available", true);

        if (error) {
          console.error("Error fetching availability:", error);
          toast.error("Erro ao carregar disponibilidade do médico");
          return;
        }

        if (data) {
          console.log("Availability data:", data);
          setDoctorAvailability(data);
          
          // Extract the days of the week that have availability
          const days = data.map(item => item.day_of_week);
          setAvailableDays([...new Set(days)]); // Remove duplicates
          console.log("Available days:", [...new Set(days)]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Erro ao carregar disponibilidade do médico");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorAvailability();
  }, [doctorId]);

  // Fetch special events
  useEffect(() => {
    const fetchSpecialEvents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("calendar_events")
          .select("*")
          .eq("doctor_id", doctorId);

        if (error) {
          console.error("Error fetching events:", error);
          toast.error("Erro ao carregar eventos especiais");
          return;
        }

        if (data) {
          setSpecialEvents(data);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Erro ao carregar eventos especiais");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecialEvents();
  }, [doctorId]);

  // Fetch reserved times for the selected date
  useEffect(() => {
    if (selectedDate) {
      const fetchReservedTimes = async () => {
        setIsLoading(true);
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        
        try {
          const { data, error } = await supabase
            .from("appointments")
            .select("time")
            .eq("date", formattedDate)
            .neq("status", "cancelado");

          if (error) {
            console.error("Error fetching appointments:", error);
            toast.error("Erro ao carregar horários reservados");
            return;
          }

          if (data) {
            const times = data.map(app => app.time.substring(0, 5));
            setReservedTimes(times);
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error("Erro ao carregar horários reservados");
        } finally {
          setIsLoading(false);
        }
      };

      fetchReservedTimes();
    }
  }, [selectedDate]);

  // Function to handle date selection and move to time selection step
  const handleDateSelection = (date: Date | undefined) => {
    if (date) {
      console.log("Selected date:", date);
      setSelectedDate(date);
      form.setValue("date", date);
      setStep("time");
    }
  };

  // Function to handle time selection and move to form step
  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    form.setValue("time", time);
    setStep("form");
  };

  // Function to handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // First, check if patient exists by email
      let patientId;
      const { data: existingPatients, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('email', data.email);
        
      if (patientError) {
        console.error("Error checking patient:", patientError);
        toast.error("Erro ao verificar paciente");
        return;
      }
      
      // If patient doesn't exist, create one
      if (!existingPatients || existingPatients.length === 0) {
        const { data: newPatient, error: createError } = await supabase
          .from('patients')
          .insert({
            name: data.name,
            email: data.email,
            phone: data.phone
          })
          .select();
          
        if (createError) {
          console.error("Error creating patient:", createError);
          toast.error("Erro ao criar paciente");
          return;
        }
        
        patientId = newPatient[0].id;
      } else {
        patientId = existingPatients[0].id;
        
        // Update patient info
        const { error: updateError } = await supabase
          .from('patients')
          .update({
            name: data.name,
            phone: data.phone
          })
          .eq('id', patientId);
          
        if (updateError) {
          console.error("Error updating patient:", updateError);
          toast.error("Erro ao atualizar paciente");
          return;
        }
      }
      
      // Now create appointment
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          date: format(data.date, "yyyy-MM-dd"),
          time: data.time,
          type: data.type,
          status: "aguardando",
          notes: data.notes || null,
          payment_method: data.paymentMethod,
          patient_id: patientId
        });
        
      if (appointmentError) {
        console.error("Error saving appointment:", appointmentError);
        toast.error("Erro ao agendar consulta");
        return;
      }
      
      // Show success message
      toast.success("Consulta agendada com sucesso!", {
        description: `${format(data.date, "dd/MM/yyyy")} às ${data.time}`,
      });
      
      // Reset form and go back to calendar
      form.reset();
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setStep("calendar");
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao agendar consulta");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to format the weekday name
  const formatWeekday = (date: Date) => {
    const weekdays = [
      "domingo",
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
    ];
    return weekdays[date.getDay()];
  };

  // Function to check if a date is available for appointments
  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay(); // 0-6 for Sunday-Saturday
    
    // First check if the day of week is in the available days list
    if (!availableDays.includes(dayOfWeek)) {
      return false;
    }
    
    // Then check for special blocks on this date
    const formattedDate = format(date, "yyyy-MM-dd");
    const hasBlocks = specialEvents.some(event => event.date === formattedDate);
    
    // Date is available if it has general availability and no blocks
    return !hasBlocks;
  };

  // Function to check if a time is within the doctor's availability for a specific date
  const isTimeAvailable = (time: string, date: Date) => {
    if (!date) return false;
    
    const dayOfWeek = date.getDay();
    const formattedDate = format(date, "yyyy-MM-dd");
    
    // Convert time string to Date object for comparison
    const timeObj = parse(time, "HH:mm", new Date());
    
    // Check if there are any special events blocking this time
    const blockingEvents = specialEvents.filter(event => {
      if (event.date !== formattedDate) return false;
      
      const eventStart = parse(event.start_time, "HH:mm", new Date());
      const eventEnd = parse(event.end_time, "HH:mm", new Date());
      
      return isWithinInterval(timeObj, { 
        start: eventStart, 
        end: eventEnd 
      });
    });
    
    if (blockingEvents.length > 0) return false;
    
    // Check if the time is within any of the doctor's available time ranges for this day
    const availableRanges = doctorAvailability.filter(
      avail => avail.day_of_week === dayOfWeek && avail.is_available
    );
    
    if (availableRanges.length === 0) return false;
    
    return availableRanges.some(range => {
      const rangeStart = parse(range.start_time.substring(0, 5), "HH:mm", new Date());
      const rangeEnd = parse(range.end_time.substring(0, 5), "HH:mm", new Date());
      
      return isWithinInterval(timeObj, { 
        start: rangeStart, 
        end: rangeEnd 
      });
    });
  };

  // Get the available times (filtering out reserved ones and times outside availability)
  const getAvailableTimes = () => {
    if (!selectedDate) return [];
    
    return AVAILABLE_TIMES.filter(time => 
      !reservedTimes.includes(time) && isTimeAvailable(time, selectedDate)
    );
  };
  
  // Render a calendar day with custom styling and interactivity
  const renderCalendarDay = (day: Date, modifiers: any) => {
    const isAvailable = isDateAvailable(day);
    
    return (
      <div className={cn(
        "relative h-10 w-10 flex items-center justify-center",
        isAvailable ? "bg-green-50 hover:bg-green-100 cursor-pointer" : "",
        modifiers.disabled ? "opacity-40 cursor-not-allowed" : ""
      )}>
        {day.getDate()}
        {isAvailable && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center">
            <div className="h-1 w-1 rounded-full bg-green-500"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button onClick={() => navigate("/")} variant="ghost" className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Agendamento de Consultas</h1>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p className="text-gray-700">Carregando...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left side - Calendar selection */}
        <div className="lg:col-span-5">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-xl">Calendário</CardTitle>
              </div>
              <CardDescription>
                Selecione uma data para ver os horários disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelection}
                disabled={(date) => 
                  isBefore(date, startOfDay(new Date())) || // No past dates
                  !isDateAvailable(date) // Check doctor availability
                }
                initialFocus
                className="mx-auto border-none w-full pointer-events-auto"
                components={{
                  Day: ({ date, ...props }) => renderCalendarDay(date, props),
                }}
              />
            </CardContent>
            <CardHeader className="pb-2 pt-0">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-xl">Médico</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    src={doctorProfile.photo || "https://via.placeholder.com/150"} 
                    alt={doctorProfile.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{doctorProfile.name}</h3>
                  <p className="text-sm text-gray-600">{doctorProfile.specialty}</p>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>{doctorProfile.bio}</p>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-green-700 mb-1 flex items-center">
                  <Check className="h-4 w-4 mr-1" /> 
                  Horários disponíveis
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {availableDays.sort().map(day => {
                    const dayAvailabilities = doctorAvailability.filter(a => a.day_of_week === day && a.is_available);
                    if (dayAvailabilities.length === 0) return null;
                    
                    return (
                      <div key={day} className="bg-green-50 rounded p-2 border border-green-100">
                        <div className="font-medium">{formatWeekday(new Date(2023, 0, day + 2))}</div>
                        <div className="text-xs text-gray-600">
                          {dayAvailabilities.map((a, i) => (
                            <div key={i}>
                              {a.start_time.substring(0, 5)} - {a.end_time.substring(0, 5)}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Time selection or Form */}
        <div className="lg:col-span-7">
          {step === "calendar" && (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="py-12 text-center">
                <CalendarIcon className="h-16 w-16 text-blue-200 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">Selecione uma data no calendário</h3>
                <p className="text-gray-600">
                  Para ver os horários disponíveis, escolha uma data no calendário à esquerda.
                </p>
              </CardContent>
            </Card>
          )}

          {step === "time" && selectedDate && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Horários do Dia</CardTitle>
                    <CardDescription className="mt-1">
                      {formatWeekday(selectedDate)}, {format(selectedDate, "dd 'de' MMMM 'de' yyyy")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getAvailableTimes().length > 0 ? (
                    getAvailableTimes().map((time) => (
                      <div 
                        key={time}
                        className={cn(
                          "border rounded-md p-3 flex justify-between items-center hover:border-blue-200 cursor-pointer"
                        )}
                        onClick={() => handleTimeSelection(time)}
                      >
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{time}</span>
                        </div>
                        <Button size="sm" variant="ghost" className="text-blue-500 p-0 h-8 hover:bg-blue-50">
                          Agendar
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10 text-gray-500">
                      <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">Sem horários disponíveis</h3>
                      <p className="text-sm max-w-md mx-auto">
                        Não há horários disponíveis para esta data. Por favor, selecione outra data no calendário.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {step === "form" && selectedDate && selectedTime && (
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <div>
                    <CardTitle className="text-xl">Complete seu agendamento</CardTitle>
                    <CardDescription className="mt-1 flex items-center space-x-1">
                      <CalendarIcon className="h-3.5 w-3.5 text-gray-500" />
                      <span>
                        {format(selectedDate, "dd/MM/yyyy")} às {selectedTime}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Digite seu nome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input placeholder="seu.email@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 00000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de consulta</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecionar tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {APPOINTMENT_TYPES.map((type) => (
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

                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Forma de pagamento</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecionar forma de pagamento" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PAYMENT_METHODS.map((method) => (
                                  <SelectItem key={method.id} value={method.id}>
                                    {method.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações ou sintomas</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva brevemente o motivo da consulta ou qualquer informação importante"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                      <Check className="mr-2 h-4 w-4" /> 
                      {isLoading ? "Processando..." : "Confirmar Agendamento"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
