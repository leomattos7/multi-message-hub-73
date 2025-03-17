
import { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, subDays, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight, Edit, User, MapPin, Phone, Mail, CheckCircle, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Sidebar } from "@/components/Sidebar";
import { supabase } from "@/integrations/supabase/client";

// Types of appointments
const APPOINTMENT_TYPES = [
  { id: "routine", name: "Consulta de Rotina" },
  { id: "followup", name: "Retorno" },
  { id: "emergency", name: "Urgência" },
  { id: "exam", name: "Resultado de Exame" }
];

// Mock data for appointments
const MOCK_APPOINTMENTS = [
  { id: 1, name: "João Silva", time: "09:00", type: "Consulta de Rotina", status: "confirmado" },
  { id: 2, name: "Maria Oliveira", time: "10:30", type: "Retorno", status: "confirmado" },
  { id: 3, name: "Pedro Santos", time: "13:00", type: "Urgência", status: "aguardando" },
  { id: 4, name: "Ana Pereira", time: "14:30", type: "Resultado de Exame", status: "confirmado" },
  { id: 5, name: "Carlos Ferreira", time: "16:00", type: "Consulta de Rotina", status: "cancelado" }
];

// Appointment schema
const appointmentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  time: z.string().min(5, { message: "Horário é obrigatório" }),
  type: z.string().min(1, { message: "Tipo de consulta é obrigatório" }),
  status: z.enum(["confirmado", "aguardando", "cancelado"]),
  notes: z.string().optional(),
});

type Appointment = z.infer<typeof appointmentSchema>;

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
  const [view, setView] = useState<"day" | "week">("day");
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>(initialDoctorProfile);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false);

  // Initialize profile edit form
  const profileForm = useForm<DoctorProfile>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: doctorProfile,
  });
  
  // Initialize appointment edit form
  const appointmentForm = useForm<Appointment>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: "",
      time: "",
      type: "",
      status: "aguardando",
      notes: "",
    }
  });

  // Reset appointment form when editing appointment changes
  useEffect(() => {
    if (editingAppointment) {
      appointmentForm.reset(editingAppointment);
    }
  }, [editingAppointment, appointmentForm]);

  // Fetch appointments from Supabase
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            date,
            time,
            type,
            status,
            notes,
            patients(name)
          `)
          .eq('date', formattedDate);

        if (error) {
          console.error('Error fetching appointments:', error);
          return;
        }

        if (data && data.length > 0) {
          // Transform data to match our component format
          const formattedAppointments = data.map(apt => ({
            id: apt.id,
            name: apt.patients?.name || 'Unknown',
            time: apt.time.substring(0, 5), // Format time from "HH:MM:SS" to "HH:MM"
            type: apt.type,
            status: apt.status,
            notes: apt.notes
          }));
          setAppointments(formattedAppointments);
        } else {
          // If no appointments, use mock data for demo purposes
          setAppointments(MOCK_APPOINTMENTS);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        // Fallback to mock data
        setAppointments(MOCK_APPOINTMENTS);
      }
    };

    fetchAppointments();
  }, [date]);

  // Navigation functions for different views
  const navigatePrevious = () => {
    if (view === "day") {
      const newDate = subDays(date, 1);
      setDate(newDate);
      toast.info(`Visualizando ${format(newDate, "dd 'de' MMMM", { locale: ptBR })}`);
    } else if (view === "week") {
      const newDate = subWeeks(date, 1);
      setDate(newDate);
      const startDate = startOfWeek(newDate, { weekStartsOn: 0 });
      const endDate = endOfWeek(newDate, { weekStartsOn: 0 });
      toast.info(`Visualizando semana de ${format(startDate, "dd/MM", { locale: ptBR })} a ${format(endDate, "dd/MM", { locale: ptBR })}`);
    }
  };

  const navigateNext = () => {
    if (view === "day") {
      const newDate = addDays(date, 1);
      setDate(newDate);
      toast.info(`Visualizando ${format(newDate, "dd 'de' MMMM", { locale: ptBR })}`);
    } else if (view === "week") {
      const newDate = addWeeks(date, 1);
      setDate(newDate);
      const startDate = startOfWeek(newDate, { weekStartsOn: 0 });
      const endDate = endOfWeek(newDate, { weekStartsOn: 0 });
      toast.info(`Visualizando semana de ${format(startDate, "dd/MM", { locale: ptBR })} a ${format(endDate, "dd/MM", { locale: ptBR })}`);
    }
  };

  const navigateToday = () => {
    const today = new Date();
    setDate(today);
    toast.success("Visualizando hoje");
  };

  // Get view range text
  const getViewRangeText = () => {
    if (view === "day") {
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } else if (view === "week") {
      const start = startOfWeek(date, { weekStartsOn: 0 });
      const end = endOfWeek(date, { weekStartsOn: 0 });
      return `${format(start, "dd/MM", { locale: ptBR })} - ${format(end, "dd/MM/yyyy", { locale: ptBR })}`;
    }
    return "";
  };

  // Handle profile update
  const onProfileSubmit = (data: DoctorProfile) => {
    setDoctorProfile(data);
    setIsEditProfileOpen(false);
    
    // Save to localStorage for persistence across app
    localStorage.setItem('doctorProfile', JSON.stringify(data));
    
    toast.success("Perfil do médico atualizado com sucesso!");
  };
  
  // Handle appointment edit
  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsEditAppointmentOpen(true);
  };
  
  // Handle appointment update
  const onAppointmentSubmit = (data: Appointment) => {
    // In a real app, update in the database
    setAppointments(appointments.map(app => 
      app.id === data.id ? data : app
    ));
    
    setIsEditAppointmentOpen(false);
    setEditingAppointment(null);
    
    toast.success("Consulta atualizada com sucesso!");
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
    return appointments;
  };

  // Get appointment type label
  const getAppointmentTypeLabel = (typeId: string) => {
    const type = APPOINTMENT_TYPES.find(t => t.id === typeId);
    return type ? type.name : typeId;
  };

  // Render the appointments for day view
  const renderDayView = () => {
    const dayAppointments = getDayAppointments();
    
    return (
      <div className="space-y-4">
        {dayAppointments.map((appointment) => (
          <Card key={appointment.id} className="border-l-4 border-l-blue-500">
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <h3 className="font-semibold">{appointment.name}</h3>
                <div className="flex gap-2 text-sm text-gray-500 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {appointment.time}
                  </span>
                  <span>•</span>
                  <span>{getAppointmentTypeLabel(appointment.type)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(appointment.status)}
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={() => handleEditAppointment(appointment)}
                  >
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
              {index < 5 && appointments.slice(0, 2).map((apt, i) => (
                <div key={i} className="bg-blue-50 p-2 rounded border-l-2 border-blue-500">
                  <div className="font-semibold">{apt.time} - {apt.name}</div>
                  <div className="text-gray-500">{getAppointmentTypeLabel(apt.type)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container max-w-6xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Painel da Secretária</h1>

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
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                            <FormField
                              control={profileForm.control}
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
                              control={profileForm.control}
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
                              control={profileForm.control}
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
                              control={profileForm.control}
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
                              control={profileForm.control}
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
                              control={profileForm.control}
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
                              control={profileForm.control}
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
                  <Tabs defaultValue="day" value={view} onValueChange={(v) => setView(v as "day" | "week")}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="day">Dia</TabsTrigger>
                      <TabsTrigger value="week">Semana</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="day" className="mt-0">
                      {renderDayView()}
                    </TabsContent>
                    
                    <TabsContent value="week" className="mt-0">
                      {renderWeekView()}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Appointment Sheet */}
      <Sheet open={isEditAppointmentOpen} onOpenChange={setIsEditAppointmentOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Editar Consulta</SheetTitle>
          </SheetHeader>
          
          <div className="py-6">
            <Form {...appointmentForm}>
              <form onSubmit={appointmentForm.handleSubmit(onAppointmentSubmit)} className="space-y-6">
                <FormField
                  control={appointmentForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Paciente</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={appointmentForm.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="00:00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={appointmentForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Consulta</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
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
                  control={appointmentForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="confirmado">Confirmado</SelectItem>
                          <SelectItem value="aguardando">Aguardando</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={appointmentForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Observações ou detalhes adicionais"
                          className="resize-none min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <SheetFooter>
                  <Button type="submit">Salvar Alterações</Button>
                </SheetFooter>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
