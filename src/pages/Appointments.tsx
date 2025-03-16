
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, addDays, startOfDay, isBefore, isToday, parseISO } from "date-fns";
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

// Available times for appointments
const AVAILABLE_TIMES = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

// Mock data for reserved times
const RESERVED_TIMES = ["09:00", "14:00", "15:00"];

// Types of appointments
const APPOINTMENT_TYPES = [
  { id: "routine", name: "Consulta de Rotina" },
  { id: "followup", name: "Retorno" },
  { id: "emergency", name: "Urgência" },
  { id: "exam", name: "Resultado de Exame" }
];

// Define form schema with zod
const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  date: z.date({ required_error: "Selecione uma data para a consulta" }),
  time: z.string({ required_error: "Selecione um horário" }),
  type: z.string({ required_error: "Selecione o tipo de atendimento" }),
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
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
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

  // Function to handle date selection and move to time selection step
  const handleDateSelection = (date: Date | undefined) => {
    if (date) {
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
  const onSubmit = (data: FormValues) => {
    // Here you would normally send this data to your backend
    console.log("Appointment data:", data);
    
    // Show success message
    toast.success("Consulta agendada com sucesso!", {
      description: `${format(data.date, "dd/MM/yyyy")} às ${data.time}`,
    });
    
    // Reset form and go back to calendar
    form.reset();
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setStep("calendar");
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

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button onClick={() => navigate("/")} variant="ghost" className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Agendamento de Consultas</h1>
      </div>

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
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelection}
                disabled={(date) => 
                  isBefore(date, startOfDay(new Date())) || // No past dates
                  date.getDay() === 0 || date.getDay() === 6 // No weekends
                }
                initialFocus
                className="mx-auto border-none"
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
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full"
                      onClick={() => setStep("calendar")}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {AVAILABLE_TIMES.map((time) => {
                    const isReserved = RESERVED_TIMES.includes(time);
                    return (
                      <div 
                        key={time}
                        className={cn(
                          "border rounded-md p-3 flex justify-between items-center",
                          isReserved 
                            ? "bg-blue-50 border-blue-100" 
                            : "hover:border-blue-200 cursor-pointer"
                        )}
                        onClick={() => !isReserved && handleTimeSelection(time)}
                      >
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{time}</span>
                        </div>
                        {isReserved ? (
                          <Badge variant="outline" className="bg-blue-100 text-blue-500 border-blue-200">
                            Reservado
                          </Badge>
                        ) : (
                          <Button size="sm" variant="ghost" className="text-blue-500 p-0 h-8 hover:bg-blue-50">
                            Agendar
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {step === "form" && selectedDate && selectedTime && (
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    className="p-0 mr-2 h-8 w-8" 
                    onClick={() => setStep("time")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
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

                    <Button type="submit" className="w-full md:w-auto">
                      <Check className="mr-2 h-4 w-4" /> Confirmar Agendamento
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
