
import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  PlusCircle, 
  Search, 
  Filter, 
  UserPlus, 
  Phone, 
  Mail, 
  FileEdit, 
  Trash2, 
  ClipboardList, 
  CalendarClock, 
  UserCheck,
  Info
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar } from "@/components/Avatar";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthGuard";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastContact: Date | null;
  nextContact: Date | null;
  status: "Ativo" | "Inativo" | "Pendente";
  notes: string;
  history: PatientInteraction[];
  photo?: string;
}

interface PatientInteraction {
  id: string;
  date: Date;
  type: "Contato Telefônico" | "Email" | "WhatsApp" | "Presencial" | "Agendamento" | "Outro";
  description: string;
  notes?: string;
}

// Dados mockados para demonstração
const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 98765-4321",
    lastContact: new Date(2023, 9, 15),
    nextContact: new Date(2023, 11, 10),
    status: "Ativo",
    notes: "Prefere ser contatada por WhatsApp",
    photo: "https://i.pravatar.cc/150?img=5",
    history: [
      {
        id: "h1",
        date: new Date(2023, 9, 15),
        type: "Contato Telefônico",
        description: "Confirmação de agendamento",
        notes: "Paciente confirmou presença"
      },
      {
        id: "h2",
        date: new Date(2023, 8, 3),
        type: "Email",
        description: "Envio de orientações gerais",
        notes: "Email com informações de localização e documentos necessários"
      }
    ]
  },
  {
    id: "2",
    name: "João Oliveira",
    email: "joao.oliveira@email.com",
    phone: "(11) 91234-5678",
    lastContact: new Date(2023, 8, 28),
    nextContact: new Date(2023, 10, 5),
    status: "Ativo",
    notes: "Primeiro contato em 28/09/2023",
    photo: "https://i.pravatar.cc/150?img=12",
    history: [
      {
        id: "h3",
        date: new Date(2023, 8, 28),
        type: "Presencial",
        description: "Preenchimento de formulário",
        notes: "Paciente veio por recomendação"
      }
    ]
  },
  {
    id: "3",
    name: "Ana Rodrigues",
    email: "ana.rodrigues@email.com",
    phone: "(11) 97777-8888",
    lastContact: new Date(2023, 7, 10),
    nextContact: null,
    status: "Inativo",
    notes: "Paciente não retornou contato após tentativas",
    photo: "https://i.pravatar.cc/150?img=9",
    history: [
      {
        id: "h4",
        date: new Date(2023, 7, 10),
        type: "WhatsApp",
        description: "Tentativa de contato",
        notes: "Mensagem enviada sem resposta"
      },
      {
        id: "h5",
        date: new Date(2023, 6, 5),
        type: "Contato Telefônico",
        description: "Ligação para confirmação",
        notes: "Paciente confirma interesse"
      }
    ]
  },
  {
    id: "4",
    name: "Pedro Santos",
    email: "pedro.santos@email.com",
    phone: "(11) 95555-6666",
    lastContact: new Date(2023, 6, 20),
    nextContact: new Date(2023, 11, 15),
    status: "Ativo",
    notes: "Prefere contato por email",
    photo: "https://i.pravatar.cc/150?img=18",
    history: [
      {
        id: "h6",
        date: new Date(2023, 6, 20),
        type: "Presencial",
        description: "Assinatura de termos",
        notes: "Paciente assinou todos os documentos necessários"
      }
    ]
  },
  {
    id: "5",
    name: "Lucia Ferreira",
    email: "lucia.ferreira@email.com",
    phone: "(11) 93333-4444",
    lastContact: null,
    nextContact: new Date(2023, 10, 22),
    status: "Pendente",
    notes: "Primeiro contato agendado",
    photo: "https://i.pravatar.cc/150?img=11",
    history: [
      {
        id: "h7",
        date: new Date(2023, 9, 30),
        type: "Email",
        description: "Email de boas-vindas",
        notes: "Paciente confirmou recebimento"
      }
    ]
  }
];

export default function PatientCRM() {
  const isMobile = useIsMobile();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [newInteraction, setNewInteraction] = useState({
    type: "Contato Telefônico" as const,
    description: "",
    notes: ""
  });
  
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";
  
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
      lastContact: null,
      nextContact: null,
      status: "Pendente",
      notes: newPatient.notes,
      history: [],
      photo: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };

    setPatients([...patients, newPatientObj]);
    setNewPatient({ name: "", email: "", phone: "", notes: "" });
    setIsAddPatientOpen(false);
    toast.success("Paciente adicionado com sucesso!");
  };

  const handleAddInteraction = () => {
    if (!selectedPatient) return;
    if (!newInteraction.description) {
      toast.error("Por favor, forneça uma descrição para a interação");
      return;
    }

    const interaction: PatientInteraction = {
      id: `h${Date.now()}`,
      date: new Date(),
      type: newInteraction.type,
      description: newInteraction.description,
      notes: newInteraction.notes
    };

    const updatedPatient = {
      ...selectedPatient,
      lastContact: new Date(),
      history: [interaction, ...selectedPatient.history]
    };

    setPatients(patients.map(p => p.id === selectedPatient.id ? updatedPatient : p));
    setSelectedPatient(updatedPatient);
    setNewInteraction({ type: "Contato Telefônico", description: "", notes: "" });
    toast.success("Interação registrada com sucesso!");
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
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Contatos</h1>
            {!isDoctor && (
              <div className="flex items-center bg-blue-100 text-blue-800 rounded-full text-xs px-2 py-1">
                <Info className="h-3 w-3 mr-1" />
                Visualização limitada
              </div>
            )}
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
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar 
                    src={selectedPatient.photo} 
                    name={selectedPatient.name} 
                    showStatus={false} 
                  />
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold">{selectedPatient.name}</h2>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      {selectedPatient.email}
                      <span className="mx-2">•</span>
                      <Phone className="h-4 w-4 mr-1" />
                      {selectedPatient.phone}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>
                    Voltar
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileEdit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="info" className="p-4">
                <TabsList>
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  {isDoctor && <TabsTrigger value="history">Histórico de Contato</TabsTrigger>}
                  {isDoctor && <TabsTrigger value="notes">Observações Detalhadas</TabsTrigger>}
                </TabsList>
                
                <TabsContent value="info" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium text-sm text-muted-foreground mb-2">Status</h3>
                      <div className={`text-sm rounded-full px-2 py-1 inline-block ${
                        selectedPatient.status === "Ativo" ? "bg-green-100 text-green-700" :
                        selectedPatient.status === "Inativo" ? "bg-gray-100 text-gray-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {selectedPatient.status}
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium text-sm text-muted-foreground mb-2">Último Contato</h3>
                      <p className="text-sm">{formatDate(selectedPatient.lastContact)}</p>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium text-sm text-muted-foreground mb-2">Próximo Contato</h3>
                      <p className="text-sm">{formatDate(selectedPatient.nextContact)}</p>
                    </div>
                    
                    {isDoctor ? (
                      <div className="rounded-lg border p-4">
                        <h3 className="font-medium text-sm text-muted-foreground mb-2">Observações</h3>
                        <p className="text-sm">{selectedPatient.notes || "Nenhuma observação"}</p>
                      </div>
                    ) : (
                      <div className="rounded-lg border p-4">
                        <h3 className="font-medium text-sm text-muted-foreground mb-2">Agendamento</h3>
                        <Button variant="outline" size="sm" asChild className="w-full justify-center mt-1">
                          <a href="/agendamentos">
                            <CalendarClock className="h-4 w-4 mr-2" />
                            Ver/Criar Agendamento
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/agendamentos">
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Ver Agendamentos
                      </a>
                    </Button>
                  </div>
                </TabsContent>
                
                {isDoctor && (
                  <TabsContent value="history" className="mt-4">
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="font-medium">Histórico de Interações</h3>
                      <Button size="sm" onClick={() => setIsHistoryDialogOpen(true)}>
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Novo Contato
                      </Button>
                    </div>
                    
                    {selectedPatient.history.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <ClipboardList className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p>Não há histórico de interações para este contato.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedPatient.history.map(interaction => (
                          <div key={interaction.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <span className={`text-xs rounded-full px-2 py-0.5 ${
                                    interaction.type === "Contato Telefônico" ? "bg-blue-100 text-blue-700" :
                                    interaction.type === "Email" ? "bg-purple-100 text-purple-700" :
                                    interaction.type === "WhatsApp" ? "bg-green-100 text-green-700" :
                                    interaction.type === "Presencial" ? "bg-yellow-100 text-yellow-700" :
                                    interaction.type === "Agendamento" ? "bg-indigo-100 text-indigo-700" :
                                    "bg-gray-100 text-gray-700"
                                  }`}>
                                    {interaction.type}
                                  </span>
                                  <h4 className="font-medium ml-2">{interaction.description}</h4>
                                </div>
                                {interaction.notes && (
                                  <p className="text-sm text-muted-foreground mt-1">{interaction.notes}</p>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {format(interaction.date, "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                )}
                
                {isDoctor && (
                  <TabsContent value="notes" className="mt-4">
                    <div className="rounded-lg border p-4 bg-muted/40">
                      <h3 className="font-medium mb-3">Observações Detalhadas</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Comentários do Médico:</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedPatient.notes || "Nenhuma observação detalhada disponível."}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Preferências de Contato:</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedPatient.id === "1" ? "Prefere contato por WhatsApp em horário comercial" : 
                             selectedPatient.id === "4" ? "Prefere contato por email" : 
                             "Não especificado"}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Informações Adicionais:</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedPatient.id === "2" ? "Paciente veio por recomendação do Dr. Roberto" : 
                             selectedPatient.id === "3" ? "Tentativas de contato sem retorno" : 
                             "Sem informações adicionais"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          ) : (
            <Table>
              <TableCaption>Lista de contatos cadastrados</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  {isDoctor && <TableHead>Último Contato</TableHead>}
                  {isDoctor && <TableHead>Próx. Contato</TableHead>}
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isDoctor ? 6 : 4} className="text-center py-10">
                      <p className="text-muted-foreground">Nenhum contato encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map(patient => (
                    <TableRow key={patient.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedPatient(patient)}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Avatar 
                            src={patient.photo} 
                            name={patient.name} 
                            showStatus={false} 
                            size="sm"
                          />
                          <span className="ml-2">{patient.name}</span>
                        </div>
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
                        <span className={`text-xs rounded-full px-2 py-1 ${
                          patient.status === "Ativo" ? "bg-green-100 text-green-700" :
                          patient.status === "Inativo" ? "bg-gray-100 text-gray-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {patient.status}
                        </span>
                      </TableCell>
                      {isDoctor && <TableCell>{formatDate(patient.lastContact)}</TableCell>}
                      {isDoctor && <TableCell>{formatDate(patient.nextContact)}</TableCell>}
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
                              // Delete functionality would be implemented here
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
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                value={newPatient.notes}
                onChange={(e) => setNewPatient({...newPatient, notes: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddPatient}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para adicionar nova interação ao histórico */}
      {isDoctor && (
        <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Contato</DialogTitle>
              <DialogDescription>
                Registre uma nova interação com o contato {selectedPatient?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="interactionType">Tipo de Contato</Label>
                <select
                  id="interactionType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newInteraction.type}
                  onChange={(e) => setNewInteraction({...newInteraction, type: e.target.value as any})}
                >
                  <option value="Contato Telefônico">Contato Telefônico</option>
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Agendamento">Agendamento</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição *</Label>
                <Input
                  id="description"
                  value={newInteraction.description}
                  onChange={(e) => setNewInteraction({...newInteraction, description: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Observações</Label>
                <Input
                  id="notes"
                  value={newInteraction.notes}
                  onChange={(e) => setNewInteraction({...newInteraction, notes: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsHistoryDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddInteraction}>Registrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
