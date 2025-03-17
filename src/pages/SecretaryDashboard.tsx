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
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Sidebar } from "@/components/Sidebar";
import { supabase } from "@/integrations/supabase/client";

const APPOINTMENT_TYPES = [
  { id: "routine", name: "Consulta de Rotina" },
  { id: "followup", name: "Retorno" },
  { id: "emergency", name: "Urgência" },
  { id: "exam", name: "Resultado de Exame" }
];

type AppointmentStatus = "confirmado" | "aguardando" | "cancelado";

const PAYMENT_METHODS = [
  { id: "insurance", name: "Plano de Saúde" },
  { id: "private", name: "Particular" }
];

interface AppointmentFromDB {
  id: string;
  date: string;
  time: string;
  type: string;
  status: AppointmentStatus;
  notes: string | null;
  payment_method: string | null;
  patient_id: string;
  patients: {
    name: string;
  } | null;
}

const MOCK_APPOINTMENTS = [
  { id: 1, name: "João Silva", time: "09:00", type: "routine", status: "confirmado" as AppointmentStatus, notes: "", paymentMethod: "insurance" },
  { id: 2, name: "Maria Oliveira", time: "10:30", type: "followup", status: "confirmado" as AppointmentStatus, notes: "", paymentMethod: "private" },
  { id: 3, name: "Pedro Santos", time: "13:00", type: "emergency", status: "aguardando" as AppointmentStatus, notes: "", paymentMethod: "insurance" },
  { id: 4, name: "Ana Pereira", time: "14:30", type: "exam", status: "confirmado" as AppointmentStatus, notes: "", paymentMethod: "insurance" },
  { id: 5, name: "Carlos Ferreira", time: "16:00", type: "routine", status: "cancelado" as AppointmentStatus, notes: "", paymentMethod: "private" }
];

const appointmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  time: z.string().min(5, { message: "Horário é obrigatório" }),
  type: z.string().min(1, { message: "Tipo de consulta é obrigatório" }),
  status: z.enum(["confirmado", "aguardando", "cancelado"]),
  paymentMethod: z.string().min(1, { message: "Forma de pagamento é obrigatória" }),
  notes: z.string().optional(),
  date: z.string().optional(),
  patient_id: z.string().optional()
});

type Appointment = z.infer<typeof appointmentSchema>;

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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const profileForm = useForm<DoctorProfile>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: doctorProfile,
  });

  const appointmentForm = useForm<Appointment>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: "",
      time: "",
      type: "",
      status: "aguardando",
      notes: "",
      paymentMethod: "insurance"
    }
  });

  useEffect(() => {
    if (editingAppointment) {
      appointmentForm.reset(editingAppointment);
    }
  }, [editingAppointment, appointmentForm]);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        let query;
        
        if (view === "day") {
          const formattedDate = format(date, 'yyyy-MM-dd');
          query = supabase
            .from('appointments')
            .select(`
              id,
              date,
              time,
              type,
              status,
              notes,
              payment_method,
              patient_id,
              patients(name)
            `)
            .eq('date', formattedDate);
        } else if (view === "week") {
          const startDate = format(startOfWeek(date, { weekStartsOn: 0 }), 'yyyy-MM-dd');
          const endDate = format(endOfWeek(date, { weekStartsOn: 0 }), 'yyyy-MM-dd');
          
          query = supabase
            .from('appointments')
            .select(`
              id,
              date,
              time,
              type,
              status,
              notes,
              payment_method,
              patient_id,
              patients(name)
            `)
            .gte('date', startDate)
            .lte('date', endDate);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching appointments:', error);
          toast.error("Erro ao carregar agendamentos");
          return;
        }

        if (data && data.length > 0) {
          const formattedAppointments = data.map((apt: AppointmentFromDB) => ({
            id: apt.id,
            name: apt.patients?.name || 'Paciente sem nome',
            time: apt.time.substring(0, 5),
            type: apt.type,
            status: apt.status as AppointmentStatus,
            notes: apt.notes || "",
            paymentMethod: apt.payment_method || "insurance",
            date: apt.date,
            patient_id: apt.patient_id
          }));
          setAppointments(formattedAppointments);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error("Erro ao carregar agendamentos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [date, view]);

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
      toast.info(`Visualizando semana de ${format(startDate, "dd/MM", { locale: ptBR })} a ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}`);
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
      toast.info(`Visualizando semana de ${format(startDate, "dd/MM", { locale: ptBR })} a ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}`);
    }
  };

  const navigateToday = () => {
    const today = new Date();
    setDate(today);
    toast.success("Visualizando hoje");
  };

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

  const onProfileSubmit = (data: DoctorProfile) => {
    setDoctorProfile(data);
    setIsEditProfileOpen(false);
    
    localStorage.setItem('doctorProfile', JSON.stringify(data));
    
    toast.success("Perfil do médico atualizado com sucesso!");
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsEditAppointmentOpen(true);
  };

  const onAppointmentSubmit = async (data: Appointment) => {
    setIsLoading(true);
    try {
      const appointmentId = editingAppointment?.id;
      
      if (!appointmentId) {
        toast.error("ID do agendamento não encontrado");
        return;
      }
      
      const originalAppointment = appointments.find(app => app.id === appointmentId);
      
      if (!originalAppointment) {
        toast.error("Agendamento original não encontrado");
        return;
      }
      
      const { error } = await supabase
        .from('appointments')
        .update({
          time: data.time,
          status: data.status,
          type: data.type,
          notes: data.notes,
          payment_method: data.paymentMethod
        })
        .eq('id', appointmentId);
      
      if (error) {
        console.error('Error updating appointment:', error);
        toast.error("Erro ao atualizar consulta");
        return;
      }
      
      setAppointments(appointments.map(app => 
        app.id === appointmentId ? {
          ...data,
          date: originalAppointment.date,
          patient_id: originalAppointment.patient_id
        } : app
      ));
      
      setIsEditAppointmentOpen(false);
      setEditingAppointment(null);
      
      toast.success("Consulta atualizada com sucesso!");
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error("Erro ao atualizar consulta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) {
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          status: 'cancelado'
        })
        .eq('id', appointmentId);
      
      if (error) {
        console.error('Error canceling appointment:', error);
        toast.error("Erro ao cancelar consulta");
        return;
      }
      
      setAppointments(appointments.map(app => 
        app.id === appointmentId ? { ...app, status: 'cancelado' as AppointmentStatus } : app
      ));
      
      toast.success("Consulta cancelada com sucesso!");
    } catch (error) {
      console.error('Error canceling appointment:', error);
      toast.error("Erro ao cancelar consulta");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
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

  const getStatusBorderColor = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmado":
        return "border-l-emerald-500";
      case "aguardando":
        return "border-l-amber-500";
      case "cancelado":
        return "border-l-red-500";
      default:
        return "border-l-blue-500";
    }
  };

  const getStatusBackgroundColor = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmado":
        return "bg-emerald-50 border-l-2 border-emerald-500";
      case "aguardando":
        return "bg-amber-50 border-l-2 border-amber-500";
      case "cancelado":
        return "bg-red-50 border-l-2 border-red-500";
      default:
        return "bg-blue-50 border-l-2 border-blue-500";
    }
  };

  const getDayAppointments = () => {
    return appointments;
  };

  const getAppointmentTypeLabel = (typeId: string) => {
    const type = APPOINTMENT_TYPES.find(t => t.id === typeId);
    return type ? type.name : typeId;
  };

  const getPaymentMethodLabel = (methodId: string) => {
    const method = PAYMENT_METHODS.find(m => m.id === methodId);
    return method ? method.name : methodId;
  };

  const getStatistics = () => {
    const total = appointments.length;
    const confirmed = appointments.filter(app => app.status === "confirmado").length;
    const pending = appointments.filter(app => app.status === "aguardando").length;
    const cancelled = appointments.filter(app => app.status === "cancelado").length;
    
    return { total, confirmed, pending, cancelled };
  };

  const renderStatistics = () => {
    const stats = getStatistics();
    
    return (
      <div className="mb-6">
        <h3 className="text-base font-medium mb-3">Estatísticas</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-md text-center">
            <p className="text-sm text-gray-500">Consultas Hoje</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-md text-center">
            <p className="text-sm text-gray-500">Confirmadas</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.confirmed}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-md text-center">
            <p className="text-sm text-gray-500">Aguardando</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-md text-center">
            <p className="text-sm text-gray-500">Canceladas</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayAppointments = getDayAppointments();
    
    if (isLoading) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">Carregando agendamentos...</p>
        </div>
      );
    }
    
    if (dayAppointments.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">Nenhum agendamento</h3>
          <p className="text-sm">Não há agendamentos para esta data.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {dayAppointments.map((appointment) => (
          <Card key={appointment.id} className={`border-l-4 ${getStatusBorderColor(appointment.status)}`}>
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <h3 className="font-semibold">{appointment.name}</h3>
                <div className="flex gap-2 text-sm text-gray-500 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {appointment.time}
                  </span>
                  <span>•</span>
                  <span>{getAppointmentTypeLabel(appointment.type)}</span>
                  <span>•</span>
                  <span>{getPaymentMethodLabel(appointment.paymentMethod)}</span>
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
                    disabled={appointment.status === "cancelado" || isLoading}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  {appointment.status !== "cancelado" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      disabled={isLoading}
                    >
                      <XCircle className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    const daysOfWeek = [];
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      daysOfWeek.push(day);
    }
    
    if (isLoading) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">Carregando agendamentos...</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-7 gap-4 h-[600px]">
        {daysOfWeek.map((day, index) => {
          const formattedDate = format(day, 'yyyy-MM-dd');
          const dayAppointments = appointments.filter(apt => 
            apt.date === formattedDate
          );
          
          return (
            <div key={index} className="border rounded-md overflow-hidden h-full">
              <div className={`p-2 text-center ${isSameDay(day, new Date()) ? 'bg-blue-100' : 'bg-gray-50'}`}>
                <div className="text-xs text-gray-500">{format(day, 'EEE', { locale: ptBR })}</div>
                <div className="font-semibold">{format(day, 'dd')}</div>
              </div>
              <div className="p-2 space-y-2 text-xs overflow-y-auto max-h-[540px]">
                {dayAppointments.length === 0 ? (
                  <div className="text-center py-4 text-gray-400 text-xs">
                    Sem agendamentos
                  </div>
                ) : (
                  dayAppointments.map((apt) => (
                    <div 
                      key={apt.id} 
                      className={`${getStatusBackgroundColor(apt.status)} p-2 rounded relative group`}
                    >
                      <div className="font-semibold">{apt.time} - {apt.name}</div>
                      <div className="text-gray-500">{getAppointmentTypeLabel(apt.type)}</div>
                      
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAppointment(apt);
                          }}
                          disabled={apt.status === "cancelado" || isLoading}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        
                        {apt.status !== "cancelado" && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAppointment(apt.id);
                            }}
                            disabled={isLoading}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleNavigateToCalendar = () => {
    navigate("/agendamentos");
    toast.info("Navegando para a tela de agendamentos");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8 px-4 max-w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Painel da Secretária</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader className="pb-0 text-center">
                  <CardTitle className="text-xl mb-4">Perfil do Médico</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="gray" 
                        className="w-full justify-center gap-2 items-center"
                        size="full"
                      >
                        <Edit className="h-4 w-4" />
                        Editar Perfil
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
                  
                  <Button 
                    variant="gray" 
                    className="w-full justify-center gap-2 items-center"
                    size="full"
                    onClick={handleNavigateToCalendar}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Agendar Nova Consulta
                  </Button>
                </CardContent>
              </Card>
            </div>

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
                    <Button variant="outline" size="sm" onClick={navigatePrevious} disabled={isLoading}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={navigateToday} disabled={isLoading}>
                      Hoje
                    </Button>
                    <Button variant="outline" size="sm" onClick={navigateNext} disabled={isLoading}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {renderStatistics()}
                  
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
                        <Input {...field} disabled />
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
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forma de Pagamento</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a forma de pagamento" />
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
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </SheetFooter>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
