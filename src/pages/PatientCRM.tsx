
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  UserPlus, 
  Phone, 
  Mail, 
  FileEdit, 
  Trash2, 
  CalendarClock,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthGuard";
import { supabase } from "@/integrations/supabase/client";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastMessageDate: Date | null;
  lastAppointmentDate: Date | null;
}

// Dados mockados para demonstração
const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 98765-4321",
    lastMessageDate: new Date(2023, 9, 15), // 15/10/2023
    lastAppointmentDate: new Date(2023, 11, 10), // 10/12/2023
  },
  {
    id: "2",
    name: "João Oliveira",
    email: "joao.oliveira@email.com",
    phone: "(11) 91234-5678",
    lastMessageDate: new Date(2023, 8, 28), // 28/09/2023
    lastAppointmentDate: new Date(2023, 10, 5), // 05/11/2023
  },
  {
    id: "3",
    name: "Ana Rodrigues",
    email: "ana.rodrigues@email.com",
    phone: "(11) 97777-8888",
    lastMessageDate: new Date(2023, 7, 10), // 10/08/2023
    lastAppointmentDate: null,
  },
  {
    id: "4",
    name: "Pedro Santos",
    email: "pedro.santos@email.com",
    phone: "(11) 95555-6666",
    lastMessageDate: new Date(2023, 6, 20), // 20/07/2023
    lastAppointmentDate: new Date(2023, 11, 15), // 15/12/2023
  },
  {
    id: "5",
    name: "Lucia Ferreira",
    email: "lucia.ferreira@email.com",
    phone: "(11) 93333-4444",
    lastMessageDate: null,
    lastAppointmentDate: new Date(2023, 10, 22), // 22/11/2023
  }
];

export default function PatientCRM() {
  const isMobile = useIsMobile();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";
  
  // Fetch patients from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('patient_id, date')
          .order('date', { ascending: false });

        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('conversation_id, timestamp')
          .order('timestamp', { ascending: false });

        const { data: conversations, error: conversationsError } = await supabase
          .from('conversations')
          .select('id, patient_id');

        const { data: patientsData, error: patientsError } = await supabase
          .from('patients')
          .select('id, name, email, phone');

        if (patientsError || appointmentsError || messagesError || conversationsError) {
          console.error("Error fetching data:", { patientsError, appointmentsError, messagesError, conversationsError });
          return;
        }

        if (patientsData) {
          // Create a map of patient_id to their last appointment date
          const patientAppointments = new Map();
          appointments?.forEach(appointment => {
            if (!patientAppointments.has(appointment.patient_id) || 
                new Date(appointment.date) > new Date(patientAppointments.get(appointment.patient_id))) {
              patientAppointments.set(appointment.patient_id, appointment.date);
            }
          });

          // Create a map of patient_id to their last message date
          const patientMessages = new Map();
          // First map conversation_id to patient_id
          const conversationToPatient = new Map();
          conversations?.forEach(conversation => {
            conversationToPatient.set(conversation.id, conversation.patient_id);
          });

          // Then map patient_id to most recent message timestamp
          messages?.forEach(message => {
            const patientId = conversationToPatient.get(message.conversation_id);
            if (patientId && (!patientMessages.has(patientId) || 
                new Date(message.timestamp) > new Date(patientMessages.get(patientId)))) {
              patientMessages.set(patientId, message.timestamp);
            }
          });

          // Format the patient data
          const formattedPatients = patientsData.map(patient => ({
            id: patient.id,
            name: patient.name,
            email: patient.email ?? "",
            phone: patient.phone ?? "",
            lastMessageDate: patientMessages.has(patient.id) ? new Date(patientMessages.get(patient.id)) : null,
            lastAppointmentDate: patientAppointments.has(patient.id) ? new Date(patientAppointments.get(patient.id)) : null,
          }));

          setPatients(formattedPatients.length > 0 ? formattedPatients : mockPatients);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients(mockPatients);
      }
    };

    fetchPatients();
  }, []);
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.email || !newPatient.phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const newPatientObj: Patient = {
      id: `${patients.length + 1}`,
      name: newPatient.name,
      email: newPatient.email,
      phone: newPatient.phone,
      lastMessageDate: null,
      lastAppointmentDate: null,
    };

    setPatients([...patients, newPatientObj]);
    setNewPatient({ name: "", email: "", phone: "" });
    setIsAddPatientOpen(false);
    toast.success("Paciente adicionado com sucesso!");
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Não definido";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <div>
            <h1 className="text-xl font-semibold">Contatos</h1>
          </div>
          <Button onClick={() => setIsAddPatientOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Contato
          </Button>
        </div>

        <div className="p-4 border-b bg-white">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar contatos por nome, email ou telefone"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {selectedPatient ? (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">{selectedPatient.name}</h2>
                <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>
                  Voltar
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  {selectedPatient.email}
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  {selectedPatient.phone}
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-500">Último Contato: {formatDate(selectedPatient.lastMessageDate)}</p>
                  <p className="text-sm text-gray-500 mt-1">Próxima Consulta: {formatDate(selectedPatient.lastAppointmentDate)}</p>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" size="sm" asChild className="w-full justify-center">
                    <a href="/agendamentos">
                      <CalendarClock className="h-4 w-4 mr-2" />
                      Ver/Criar Agendamento
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Table>
              <TableCaption>Lista de contatos cadastrados</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Último Contato</TableHead>
                  <TableHead>Próx. Contato</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <p className="text-muted-foreground">Nenhum contato encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map(patient => (
                    <TableRow key={patient.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedPatient(patient)}>
                      <TableCell className="font-medium">
                        {patient.name}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                            {patient.email}
                          </div>
                          <div className="flex items-center mt-1">
                            <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                            {patient.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(patient.lastMessageDate)}
                      </TableCell>
                      <TableCell>
                        {formatDate(patient.lastAppointmentDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(patient);
                          }}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          {isDoctor && (
                            <Button variant="ghost" size="icon" onClick={(e) => {
                              e.stopPropagation();
                              toast.error("Função de exclusão em desenvolvimento");
                            }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Dialog para adicionar novo paciente */}
      <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Contato</DialogTitle>
            <DialogDescription>
              Preencha os dados básicos do contato. Os campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddPatient}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
