
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addMonths, addWeeks, subMonths, subWeeks, subDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ArrowLeft, Edit, User, MapPin, Phone, Mail, CheckCircle, XCircle, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";

// Mock data for appointments
const MOCK_APPOINTMENTS = [
  { id: 1, name: "João Silva", time: "09:00", type: "Consulta de Rotina", status: "confirmado" },
  { id: 2, name: "Maria Oliveira", time: "10:30", type: "Retorno", status: "confirmado" },
  { id: 3, name: "Pedro Santos", time: "13:00", type: "Urgência", status: "aguardando" },
  { id: 4, name: "Ana Pereira", time: "14:30", type: "Resultado de Exame", status: "confirmado" },
  { id: 5, name: "Carlos Ferreira", time: "16:00", type: "Consulta de Rotina", status: "cancelado" }
];

// Doctor profile schema
const doctorProfileSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  specialty: z.string().min(2, { message: "Especialidade é obrigatória" }),
  bio: z.string().min(10, { message: "Bio deve ter pelo menos 10 caracteres" }),
  photo: z.string().optional(),
  address: z.string().min(5, { message: "Endereço é obrigatório" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  email: z.string().email({ message: "Email inválido" }),
});

type DoctorProfile = z.infer<typeof doctorProfileSchema>;

// Initial doctor profile
const initialDoctorProfile: DoctorProfile = {
  name: "Dra. Ana Silva",
  specialty: "Clínico Geral",
  bio: "Médica com mais de 10 anos de experiência em clínica geral, especializada em saúde preventiva e bem-estar.",
  photo: "https://randomuser.me/api/portraits/women/68.jpg",
  address: "Av. Paulista, 1000, São Paulo - SP",
  phone: "(11) 95555-5555",
  email: "dra.anasilva@clinica.com.br",
};

export default function SecretaryDashboard() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>(initialDoctorProfile);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Initialize profile edit form
  const form = useForm<DoctorProfile>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: doctorProfile,
  });

  // Navigation functions for different views
  const navigatePrevious = () => {
    if (view === "day") setDate(subDays(date, 1));
    else if (view === "week") setDate(subWeeks(date, 1));
    else if (view === "month") setDate(subMonths(date, 1));
  };

  const navigateNext = () => {
    if (view === "day") setDate(addDays(date, 1));
    else if (view === "week") setDate(addWeeks(date, 1));
    else if (view === "month") setDate(addMonths(date, 1));
  };

  const navigateToday = () => {
    setDate(new Date());
  };

  // Get view range text
  const getViewRangeText = () => {
    if (view === "day") {
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } else if (view === "week") {
      const start = startOfWeek(date, { weekStartsOn: 0 });
      const end = endOfWeek(date, { weekStartsOn: 0 });
      return `${format(start, "dd/MM", { locale: ptBR })} - ${format(end, "dd/MM/yyyy", { locale: ptBR })}`;
    } else if (view === "month") {
      return format(date, "MMMM 'de' yyyy", { locale: ptBR });
    }
    return "";
  };

  // Handle profile update
  const onProfileSubmit = (data: DoctorProfile) => {
    setDoctorProfile(data);
    setIsEditProfileOpen(false);
    toast.success("Perfil do médico atualizado com sucesso!");
  };

  // Get status badge class
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmado":
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full text-xs">
            <CheckCircle className="h-3 w-3" /> Confirmado
          </span>
        );
      case "aguardando":
        return (
          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-1 rounded-full text-xs">
            <Clock className="h-3 w-3" /> Aguardando
          </span>
        );
      case "cancelado":
        return (
          <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs">
            <XCircle className="h-3 w-3" /> Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  // Filter appointments for the current day
  const getDayAppointments = () => {
    // In a real application, filter from backend based on date
    return MOCK_APPOINTMENTS;
  };

  // Render the appointments for day view
  const renderDayView = () => {
    const appointments = getDayAppointments();
    
    return (
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="border-l-4 border-l-blue-500">
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <h3 className="font-semibold">{appointment.name}</h3>
                <div className="flex gap-2 text-sm text-gray-500 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {appointment.time}
                  </span>
                  <span>•</span>
                  <span>{appointment.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(appointment.status)}
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-8 px-2">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Render the appointments for week view
  const renderWeekView = () => {
    const daysOfWeek = [];
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      daysOfWeek.push(day);
    }
    
    return (
      <div className="grid grid-cols-7 gap-4 h-[600px]">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="border rounded-md overflow-hidden h-full">
            <div className={`p-2 text-center ${isSameDay(day, new Date()) ? 'bg-blue-100' : 'bg-gray-50'}`}>
              <div className="text-xs text-gray-500">{format(day, 'EEE', { locale: ptBR })}</div>
              <div className="font-semibold">{format(day, 'dd')}</div>
            </div>
            <div className="p-2 space-y-2 text-xs">
              {/* In a real app, filter appointments for each day */}
              {index < 5 && MOCK_APPOINTMENTS.slice(0, 2).map((apt, i) => (
                <div key={i} className="bg-blue-50 p-2 rounded border-l-2 border-blue-500">
                  <div className="font-semibold">{apt.time} - {apt.name}</div>
                  <div className="text-gray-500">{apt.type}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render the appointments for month view
  const renderMonthView = () => {
    return (
      <div className="h-[600px]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="rounded-md border h-full"
          classNames={{
            cell: "h-14 w-14 text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-12 w-12 p-0 font-normal",
            day_selected: "bg-blue-500 text-white hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white rounded-full",
          }}
        />
      </div>
    );
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Button onClick={() => navigate("/")} variant="ghost" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Painel da Secretária</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/agendamentos")}>
            Ver Página de Agendamentos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left sidebar - Doctor profile */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">Perfil do Médico</CardTitle>
                <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Editar Perfil do Médico</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="specialty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Especialidade</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Biografia</FormLabel>
                              <FormControl>
                                <Textarea {...field} className="resize-none" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="photo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL da Foto</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Endereço</FormLabel>
                              <FormControl>
                                <Input {...field} />
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
                                <Input {...field} />
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
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="submit">Salvar Alterações</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full overflow-hidden mb-3">
                  <img
                    src={doctorProfile.photo || "https://via.placeholder.com/150"}
                    alt={doctorProfile.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{doctorProfile.name}</h3>
                <p className="text-blue-600">{doctorProfile.specialty}</p>
              </div>
              
              <p className="text-sm text-gray-600">{doctorProfile.bio}</p>
              
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span>{doctorProfile.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{doctorProfile.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{doctorProfile.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Consultas Hoje</p>
                  <p className="text-2xl font-bold text-blue-600">5</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Confirmadas</p>
                  <p className="text-2xl font-bold text-emerald-600">3</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Aguardando</p>
                  <p className="text-2xl font-bold text-amber-600">1</p>
                </div>
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Canceladas</p>
                  <p className="text-2xl font-bold text-red-600">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content - Calendar views */}
        <div className="lg:col-span-9">
          <Card className="h-full">
            <CardHeader className="pb-2 flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-500" />
                  Agenda de Consultas
                </CardTitle>
                <CardDescription className="mt-1">
                  {getViewRangeText()}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={navigatePrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={navigateToday}>
                  Hoje
                </Button>
                <Button variant="outline" size="sm" onClick={navigateNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="day" value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")}>
                <TabsList className="mb-4">
                  <TabsTrigger value="day">Dia</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="month">Mês</TabsTrigger>
                </TabsList>
                
                <TabsContent value="day" className="mt-0">
                  {renderDayView()}
                </TabsContent>
                
                <TabsContent value="week" className="mt-0">
                  {renderWeekView()}
                </TabsContent>
                
                <TabsContent value="month" className="mt-0">
                  {renderMonthView()}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
