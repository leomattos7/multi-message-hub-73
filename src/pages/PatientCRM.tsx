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
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Save,
  X,
  MapPin,
  Clipboard
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { ContactFilters, PatientFilters } from "@/components/ContactFilters";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  lastMessageDate: Date | null;
  lastAppointmentDate: Date | null;
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 98765-4321",
    address: "Av. Paulista, 1000, São Paulo - SP",
    notes: "Paciente com histórico de hipertensão",
    lastMessageDate: new Date(2023, 9, 15),
    lastAppointmentDate: new Date(2023, 11, 10),
  },
  {
    id: "2",
    name: "João Oliveira",
    email: "joao.oliveira@email.com",
    phone: "(11) 91234-5678",
    address: "Rua Augusta, 500, São Paulo - SP",
    notes: "Preferência por consultas matutinas",
    lastMessageDate: new Date(2023, 8, 28),
    lastAppointmentDate: new Date(2023, 10, 5),
  },
  {
    id: "3",
    name: "Ana Rodrigues",
    email: "ana.rodrigues@email.com",
    phone: "(11) 97777-8888",
    lastMessageDate: new Date(2023, 7, 10),
    lastAppointmentDate: null,
  },
  {
    id: "4",
    name: "Pedro Santos",
    email: "pedro.santos@email.com",
    phone: "(11) 95555-6666",
    lastMessageDate: new Date(2023, 6, 20),
    lastAppointmentDate: new Date(2023, 11, 15),
  },
  {
    id: "5",
    name: "Lucia Ferreira",
    email: "lucia.ferreira@email.com",
    phone: "(11) 93333-4444",
    lastMessageDate: null,
    lastAppointmentDate: new Date(2023, 10, 22),
  }
];

export default function PatientCRM() {
  const isMobile = useIsMobile();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [editingPatient, setEditingPatient] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [patientFilters, setPatientFilters] = useState<PatientFilters>({
    name: "",
    email: "",
    phone: "",
    hasAppointment: null,
    hasMessages: null,
    sortBy: "name",
    sortOrder: "asc",
    address: "",
    notes: ""
  });
  
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";
  
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
          .select('id, name, email, phone, address, notes');

        if (patientsError || appointmentsError || messagesError || conversationsError) {
          console.error("Error fetching data:", { patientsError, appointmentsError, messagesError, conversationsError });
          return;
        }

        if (patientsData) {
          const patientAppointments = new Map();
          appointments?.forEach(appointment => {
            if (!patientAppointments.has(appointment.patient_id) || 
                new Date(appointment.date) > new Date(patientAppointments.get(appointment.patient_id))) {
              patientAppointments.set(appointment.patient_id, appointment.date);
            }
          });

          const patientMessages = new Map();
          const conversationToPatient = new Map();
          conversations?.forEach(conversation => {
            conversationToPatient.set(conversation.id, conversation.patient_id);
          });

          messages?.forEach(message => {
            const patientId = conversationToPatient.get(message.conversation_id);
            if (patientId && (!patientMessages.has(patientId) || 
                new Date(message.timestamp) > new Date(patientMessages.get(patientId)))) {
              patientMessages.set(patientId, message.timestamp);
            }
          });

          const formattedPatients = patientsData.map(patient => ({
            id: patient.id,
            name: patient.name,
            email: patient.email ?? "",
            phone: patient.phone ?? "",
            address: patient.address ?? "",
            notes: patient.notes ?? "",
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
  
  const applyFilters = (patientsList: Patient[]): Patient[] => {
    let filtered = patientsList;
    
    if (searchTerm) {
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      );
    }
    
    if (patientFilters.name) {
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(patientFilters.name.toLowerCase())
      );
    }
    
    if (patientFilters.email) {
      filtered = filtered.filter(patient => 
        patient.email.toLowerCase().includes(patientFilters.email.toLowerCase())
      );
    }
    
    if (patientFilters.phone) {
      filtered = filtered.filter(patient => 
        patient.phone.includes(patientFilters.phone)
      );
    }
    
    if (patientFilters.address) {
      filtered = filtered.filter(patient => 
        patient.address?.toLowerCase().includes(patientFilters.address.toLowerCase())
      );
    }
    
    if (patientFilters.notes) {
      filtered = filtered.filter(patient => 
        patient.notes?.toLowerCase().includes(patientFilters.notes.toLowerCase())
      );
    }
    
    if (patientFilters.hasAppointment !== null) {
      filtered = filtered.filter(patient => 
        patientFilters.hasAppointment ? patient.lastAppointmentDate !== null : patient.lastAppointmentDate === null
      );
    }
    
    if (patientFilters.hasMessages !== null) {
      filtered = filtered.filter(patient => 
        patientFilters.hasMessages ? patient.lastMessageDate !== null : patient.lastMessageDate === null
      );
    }
    
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (patientFilters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "lastAppointment":
          if (a.lastAppointmentDate === null && b.lastAppointmentDate === null) {
            comparison = 0;
          } else if (a.lastAppointmentDate === null) {
            comparison = -1;
          } else if (b.lastAppointmentDate === null) {
            comparison = 1;
          } else {
            comparison = a.lastAppointmentDate.getTime() - b.lastAppointmentDate.getTime();
          }
          break;
        case "lastMessage":
          if (a.lastMessageDate === null && b.lastMessageDate === null) {
            comparison = 0;
          } else if (a.lastMessageDate === null) {
            comparison = -1;
          } else if (b.lastMessageDate === null) {
            comparison = 1;
          } else {
            comparison = a.lastMessageDate.getTime() - b.lastMessageDate.getTime();
          }
          break;
      }
      
      return patientFilters.sortOrder === "asc" ? comparison : -comparison;
    });
    
    return filtered;
  };

  const filteredPatients = applyFilters(patients);

  const handleAddPatient = async () => {
    if (!newPatient.name) {
      toast.error("Por favor, preencha o nome do contato");
      return;
    }

    try {
      let newPatientId = "";
      
      if (supabase) {
        const { data, error } = await supabase
          .from('patients')
          .insert({
            name: newPatient.name,
            email: newPatient.email || null,
            phone: newPatient.phone || null,
            address: newPatient.address || null,
            notes: newPatient.notes || null
          })
          .select();
          
        if (error) {
          console.error("Error inserting patient in Supabase:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          newPatientId = data[0].id;
        }
      } else {
        newPatientId = `${patients.length + 1}`;
      }

      const newPatientObj: Patient = {
        id: newPatientId,
        name: newPatient.name,
        email: newPatient.email,
        phone: newPatient.phone,
        address: newPatient.address,
        notes: newPatient.notes,
        lastMessageDate: null,
        lastAppointmentDate: null,
      };

      setPatients([...patients, newPatientObj]);
      setNewPatient({ name: "", email: "", phone: "", address: "", notes: "" });
      setIsAddPatientOpen(false);
      toast.success("Paciente adicionado com sucesso!");
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Erro ao adicionar paciente. Por favor, tente novamente.");
    }
  };

  const handleEditClick = (patient: Patient, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPatient({
      id: patient.id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      address: patient.address || "",
      notes: patient.notes || "",
    });
    setIsEditPatientOpen(true);
  };

  const handleUpdatePatient = async () => {
    if (!editingPatient.name) {
      toast.error("Por favor, preencha o nome do contato");
      return;
    }

    try {
      if (supabase) {
        const { error } = await supabase
          .from('patients')
          .update({
            name: editingPatient.name,
            email: editingPatient.email || null,
            phone: editingPatient.phone || null,
            address: editingPatient.address || null,
            notes: editingPatient.notes || null
          })
          .eq('id', editingPatient.id);
          
        if (error) {
          console.error("Error updating patient in Supabase:", error);
          throw error;
        }
      }
      
      const updatedPatients = patients.map(patient => {
        if (patient.id === editingPatient.id) {
          return {
            ...patient,
            name: editingPatient.name,
            email: editingPatient.email,
            phone: editingPatient.phone,
            address: editingPatient.address,
            notes: editingPatient.notes,
          };
        }
        return patient;
      });
      
      setPatients(updatedPatients);
      
      if (selectedPatient && selectedPatient.id === editingPatient.id) {
        setSelectedPatient({
          ...selectedPatient,
          name: editingPatient.name,
          email: editingPatient.email,
          phone: editingPatient.phone,
          address: editingPatient.address,
          notes: editingPatient.notes,
        });
      }
      
      setIsEditPatientOpen(false);
      toast.success("Contato atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Erro ao atualizar contato. Por favor, tente novamente.");
    }
  };

  const handleDeleteClick = (patient: Patient, e: React.MouseEvent) => {
    e.stopPropagation();
    setPatientToDelete(patient);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
    
    try {
      if (supabase) {
        const { data: conversations, error: conversationsError } = await supabase
          .from('conversations')
          .select('id')
          .eq('patient_id', patientToDelete.id);
          
        if (conversationsError) {
          console.error("Error fetching conversations:", conversationsError);
        } else if (conversations && conversations.length > 0) {
          for (const conversation of conversations) {
            const { error: deleteMessagesError } = await supabase
              .from('messages')
              .delete()
              .eq('conversation_id', conversation.id);
              
            if (deleteMessagesError) {
              console.error("Error deleting messages:", deleteMessagesError);
            }
          }
          
          const { error: deleteConversationsError } = await supabase
            .from('conversations')
            .delete()
            .eq('patient_id', patientToDelete.id);
            
          if (deleteConversationsError) {
            console.error("Error deleting conversations:", deleteConversationsError);
          }
        }
        
        const { error: deleteAppointmentsError } = await supabase
          .from('appointments')
          .delete()
          .eq('patient_id', patientToDelete.id);
          
        if (deleteAppointmentsError) {
          console.error("Error deleting appointments:", deleteAppointmentsError);
        }
        
        const { error: deletePatientError } = await supabase
          .from('patients')
          .delete()
          .eq('id', patientToDelete.id);
          
        if (deletePatientError) {
          console.error("Error deleting patient:", deletePatientError);
          toast.error("Erro ao excluir contato. Tente novamente.");
          return;
        }
      }
      
      const updatedPatients = patients.filter(p => p.id !== patientToDelete.id);
      setPatients(updatedPatients);
      
      if (selectedPatient && selectedPatient.id === patientToDelete.id) {
        setSelectedPatient(null);
      }
      
      setIsDeleteDialogOpen(false);
      setPatientToDelete(null);
      toast.success("Contato excluído com sucesso!");
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error("Erro ao excluir contato. Por favor, tente novamente.");
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Não definido";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const handleResetFilters = () => {
    setPatientFilters({
      name: "",
      email: "",
      phone: "",
      hasAppointment: null,
      hasMessages: null,
      sortBy: "name",
      sortOrder: "asc",
      address: "",
      notes: ""
    });
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
            <Button 
              variant="outline"
              onClick={() => setIsFilterDialogOpen(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros {Object.values(patientFilters).some(value => 
                value !== "" && value !== null && value !== "name" && value !== "asc") && 
                <span className="ml-1 bg-blue-500 text-white rounded-full w-2 h-2" />}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {selectedPatient ? (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">{selectedPatient.name}</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => handleEditClick(selectedPatient, e)}
                  >
                    <FileEdit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  {isDoctor && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => handleDeleteClick(selectedPatient, e)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedPatient(null)}
                  >
                    Voltar
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  {selectedPatient.email || "Não informado"}
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  {selectedPatient.phone || "Não informado"}
                </div>
                
                {selectedPatient.address && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {selectedPatient.address}
                  </div>
                )}
                
                {selectedPatient.notes && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center text-sm font-medium mb-1">
                      <Clipboard className="h-4 w-4 mr-2 text-gray-500" />
                      Anotações
                    </div>
                    <p className="text-sm text-gray-700 pl-6">{selectedPatient.notes}</p>
                  </div>
                )}
                
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-500">Última Mensagem: {formatDate(selectedPatient.lastMessageDate)}</p>
                  <p className="text-sm text-gray-500 mt-1">Última Consulta: {formatDate(selectedPatient.lastAppointmentDate)}</p>
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
                  <TableHead>Última Mensagem</TableHead>
                  <TableHead>Última Consulta</TableHead>
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
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleEditClick(patient, e)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          {isDoctor && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => handleDeleteClick(patient, e)}
                            >
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={newPatient.address}
                onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Anotações</Label>
              <Textarea
                id="notes"
                value={newPatient.notes}
                onChange={(e) => setNewPatient({...newPatient, notes: e.target.value})}
                placeholder="Informações adicionais sobre o contato..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddPatient}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditPatientOpen} onOpenChange={setIsEditPatientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Contato</DialogTitle>
            <DialogDescription>
              Atualize os dados do contato. Os campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome completo *</Label>
              <Input
                id="edit-name"
                value={editingPatient.name}
                onChange={(e) => setEditingPatient({...editingPatient, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editingPatient.email}
                onChange={(e) => setEditingPatient({...editingPatient, email: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={editingPatient.phone}
                onChange={(e) => setEditingPatient({...editingPatient, phone: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Endereço</Label>
              <Input
                id="edit-address"
                value={editingPatient.address}
                onChange={(e) => setEditingPatient({...editingPatient, address: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Anotações</Label>
              <Textarea
                id="edit-notes"
                value={editingPatient.notes}
                onChange={(e) => setEditingPatient({...editingPatient, notes: e.target.value})}
                placeholder="Informações adicionais sobre o contato..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPatientOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleUpdatePatient}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o contato
              <strong> {patientToDelete?.name}</strong> e todos os dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPatientToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeletePatient}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ContactFilters 
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={patientFilters}
        onFiltersChange={setPatientFilters}
        onApplyFilters={() => setIsFilterDialogOpen(false)}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
