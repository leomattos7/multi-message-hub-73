import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Plus,
  MapPin,
  ClipboardEdit,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { CollapsibleSectionsContainer } from "@/components/patient/CollapsibleSectionsContainer";
import { SectionType } from "@/hooks/use-collapsible-sections";

interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  birth_date?: string;
  biological_sex?: string;
  gender_identity?: string;
}

interface MedicalRecord {
  id: string;
  patient_id: string;
  record_date: string;
  record_type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function PatientMedicalRecords() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [recordContent, setRecordContent] = useState("");
  const [recordType, setRecordType] = useState("anamnesis");
  const [editPatientData, setEditPatientData] = useState<Patient | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    setIsInfoOpen(!isMobile);
  }, [isMobile]);

  const { data: patient, isLoading: patientLoading, refetch: refetchPatient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      if (!patientId) throw new Error("Patient ID is required");
      
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single();
      
      if (error) throw error;
      return data as Patient;
    }
  });

  const { data: records, isLoading: recordsLoading, refetch: refetchRecords } = useQuery({
    queryKey: ["patient-records", patientId, activeTab],
    queryFn: async () => {
      if (!patientId) throw new Error("Patient ID is required");
      
      let query = supabase
        .from("patient_records")
        .select("*")
        .eq("patient_id", patientId);

      if (activeTab !== "all") {
        query = query.eq("record_type", activeTab);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      
      return data as MedicalRecord[];
    },
    enabled: !!patientId,
  });

  const calculateAge = (birthDate: string | undefined): number => {
    if (!birthDate) return 0;
    
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatBirthDate = (birthDate: string | undefined): string => {
    if (!birthDate) return 'Não informado';
    
    const date = new Date(birthDate);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const createNewRecord = async () => {
    if (!patientId || !recordContent.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      const currentDate = new Date().toISOString();
      
      const { error } = await supabase
        .from("patient_records")
        .insert({
          patient_id: patientId,
          record_date: currentDate,
          record_type: recordType,
          content: recordContent,
        });

      if (error) throw error;

      toast({
        title: "Prontuário criado",
        description: "O prontuário foi criado com sucesso.",
      });

      setRecordContent("");
      setRecordType("anamnesis");
      setIsNewRecordOpen(false);
      
      refetchRecords();
    } catch (error) {
      console.error("Error creating record:", error);
      toast({
        title: "Erro ao criar prontuário",
        description: "Houve um erro ao criar o prontuário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const updatePatient = async () => {
    if (!patientId || !editPatientData || !editPatientData.name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome do paciente é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("patients")
        .update({
          name: editPatientData.name,
          email: editPatientData.email || null,
          phone: editPatientData.phone || null,
          address: editPatientData.address || null,
          notes: editPatientData.notes || null,
          birth_date: editPatientData.birth_date || null,
          biological_sex: editPatientData.biological_sex || null,
          gender_identity: editPatientData.gender_identity || null
        })
        .eq("id", patientId);

      if (error) throw error;

      toast({
        title: "Paciente atualizado",
        description: "Os dados do paciente foram atualizados com sucesso.",
      });

      setIsEditPatientOpen(false);
      refetchPatient();
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Erro ao atualizar paciente",
        description: "Houve um erro ao atualizar os dados do paciente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditPatient = () => {
    if (patient) {
      setEditPatientData({ ...patient });
      setIsEditPatientOpen(true);
    }
  };

  const viewRecordDetails = (record: MedicalRecord) => {
    navigate(`/prontuarios/${record.id}`);
  };

  const recordTypes = [
    { value: "anamnesis", label: "Anamnese" },
    { value: "consultation", label: "Consulta" },
    { value: "exam", label: "Exame" },
    { value: "prescription", label: "Receita" },
    { value: "evolution", label: "Evolução" },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const recordTypeDisplay: Record<string, string> = {
    anamnesis: "Anamnese",
    consultation: "Consulta",
    exam: "Exame",
    prescription: "Receita",
    evolution: "Evolução",
  };

  const renderSectionContent = (sectionId: SectionType) => {
    switch (sectionId) {
      case "medicacoes":
        return <p>Lista de medicações prescritas anteriormente</p>;
      case "problemas":
        return <p>Lista de problemas e diagnósticos do paciente</p>;
      case "exames":
        return <p>Resultados dos últimos exames realizados</p>;
      case "medicacoes_atuais":
        return <p>Medicações em uso atual pelo paciente</p>;
      case "antecedente_pessoal":
        return <p>Histórico médico pessoal do paciente</p>;
      case "historico_familiar":
        return <p>Doenças e condições presentes na família do paciente</p>;
      default:
        return <p>Informações não disponíveis</p>;
    }
  };

  if (patientLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados do paciente...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/prontuarios")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <User className="h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-600">Paciente não encontrado</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/prontuarios")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">{patient.name}</h1>
        </div>
        
        <Dialog open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Registro</DialogTitle>
              <DialogDescription>
                Adicione um novo registro ao prontuário de {patient.name}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="recordType" className="text-sm font-medium">
                  Tipo de Registro
                </Label>
                <select 
                  id="recordType"
                  className="w-full p-2 border rounded-md"
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                >
                  {recordTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Conteúdo
                </Label>
                <Textarea
                  id="content"
                  className="min-h-[200px]"
                  value={recordContent}
                  onChange={(e) => setRecordContent(e.target.value)}
                  placeholder="Digite o conteúdo do registro"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewRecordOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={createNewRecord}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Dialog open={isEditPatientOpen} onOpenChange={setIsEditPatientOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Dados do Paciente</DialogTitle>
            <DialogDescription>
              Atualize as informações do paciente conforme necessário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo*</Label>
              <Input
                id="name"
                value={editPatientData?.name || ''}
                onChange={(e) => setEditPatientData(prev => prev ? {...prev, name: e.target.value} : null)}
                placeholder="Digite o nome do paciente"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birth_date">Data de Nascimento</Label>
              <Input
                id="birth_date"
                type="date"
                value={editPatientData?.birth_date ? editPatientData.birth_date.split('T')[0] : ''}
                onChange={(e) => setEditPatientData(prev => prev ? {...prev, birth_date: e.target.value} : null)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="biological_sex">Sexo Biológico</Label>
              <Select
                value={editPatientData?.biological_sex || ''}
                onValueChange={(value) => setEditPatientData(prev => prev ? {...prev, biological_sex: value} : null)}
              >
                <SelectTrigger id="biological_sex">
                  <SelectValue placeholder="Selecione o sexo biológico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="intersex">Intersexo</SelectItem>
                  <SelectItem value="not_informed">Não Informado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender_identity">Identidade de Gênero</Label>
              <Select
                value={editPatientData?.gender_identity || ''}
                onValueChange={(value) => setEditPatientData(prev => prev ? {...prev, gender_identity: value} : null)}
              >
                <SelectTrigger id="gender_identity">
                  <SelectValue placeholder="Selecione a identidade de gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="man">Homem</SelectItem>
                  <SelectItem value="woman">Mulher</SelectItem>
                  <SelectItem value="non_binary">Não-Binário</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                  <SelectItem value="not_informed">Não Informado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editPatientData?.email || ''}
                onChange={(e) => setEditPatientData(prev => prev ? {...prev, email: e.target.value} : null)}
                placeholder="Digite o email do paciente"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={editPatientData?.phone || ''}
                onChange={(e) => setEditPatientData(prev => prev ? {...prev, phone: e.target.value} : null)}
                placeholder="Digite o telefone do paciente"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={editPatientData?.address || ''}
                onChange={(e) => setEditPatientData(prev => prev ? {...prev, address: e.target.value} : null)}
                placeholder="Digite o endereço do paciente"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Anotações</Label>
              <Textarea
                id="notes"
                value={editPatientData?.notes || ''}
                onChange={(e) => setEditPatientData(prev => prev ? {...prev, notes: e.target.value} : null)}
                placeholder="Informações adicionais sobre o paciente"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPatientOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={updatePatient}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CollapsibleSectionsContainer 
            patientId={patientId} 
            renderSectionContent={renderSectionContent} 
          />
        </div>
        
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex overflow-x-auto mb-6">
              <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
              <TabsTrigger value="anamnesis" className="flex-1">Anamnese</TabsTrigger>
              <TabsTrigger value="consultation" className="flex-1">Consulta</TabsTrigger>
              <TabsTrigger value="exam" className="flex-1">Exame</TabsTrigger>
              <TabsTrigger value="prescription" className="flex-1">Receita</TabsTrigger>
              <TabsTrigger value="evolution" className="flex-1">Evolução</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {recordsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando registros...</p>
                </div>
              ) : records && records.length > 0 ? (
                <div className="space-y-4">
                  {records.map((record) => (
                    <Card 
                      key={record.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => viewRecordDetails(record)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <CardTitle className="text-lg">{recordTypeDisplay[record.record_type]}</CardTitle>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(record.created_at)}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-3">{record.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                  <FileText className="h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-600">Nenhum registro encontrado</h3>
                  <p className="text-gray-500 mt-1">
                    Crie seu primeiro registro clicando no botão "Novo Registro"
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
