
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Plus, 
  FileText, 
  Calendar, 
  User, 
  Clock, 
  MoreHorizontal,
  Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

// Defining the structure of a patient record
interface PatientRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  record_date: string;
  record_type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Defining the structure of a patient with minimal information
interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export default function MedicalRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [recordContent, setRecordContent] = useState("");
  const [recordType, setRecordType] = useState("anamnesis");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  // Fetch patients
  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, name, email, phone")
        .order("name");
      
      if (error) throw error;
      return data as Patient[];
    }
  });

  // Fetch records based on filters
  const { data: records, isLoading: recordsLoading, refetch: refetchRecords } = useQuery({
    queryKey: ["medical-records", activeTab, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("patient_records")
        .select(`
          id, 
          record_date, 
          record_type, 
          content, 
          created_at, 
          updated_at,
          patient_id,
          patients(name)
        `);

      // Apply filter based on active tab
      if (activeTab !== "all") {
        query = query.eq("record_type", activeTab);
      }

      // Apply search filter if provided
      if (searchQuery) {
        query = query.or(`content.ilike.%${searchQuery}%,patients.name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our PatientRecord interface
      return data.map(record => ({
        id: record.id,
        patient_id: record.patient_id,
        patient_name: record.patients?.name || "Unknown",
        record_date: record.record_date,
        record_type: record.record_type,
        content: record.content,
        created_at: record.created_at,
        updated_at: record.updated_at,
      })) as PatientRecord[];
    },
    enabled: true,
  });

  // Handle creating a new medical record
  const createNewRecord = async () => {
    if (!selectedPatient || !recordContent.trim()) {
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
          patient_id: selectedPatient.id,
          record_date: currentDate,
          record_type: recordType,
          content: recordContent,
        });

      if (error) throw error;

      toast({
        title: "Prontuário criado",
        description: "O prontuário foi criado com sucesso.",
      });

      // Reset form and close dialog
      setSelectedPatient(null);
      setRecordContent("");
      setRecordType("anamnesis");
      setIsNewRecordOpen(false);
      
      // Refetch records to update the list
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

  // Function to view a patient's record details
  const viewRecordDetails = (record: PatientRecord) => {
    navigate(`/prontuarios/${record.id}`);
  };

  // Record type options for the dropdown
  const recordTypes = [
    { value: "anamnesis", label: "Anamnese" },
    { value: "consultation", label: "Consulta" },
    { value: "exam", label: "Exame" },
    { value: "prescription", label: "Receita" },
    { value: "evolution", label: "Evolução" },
  ];

  // Format date helper function
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

  // Record type display mapping
  const recordTypeDisplay: Record<string, string> = {
    anamnesis: "Anamnese",
    consultation: "Consulta",
    exam: "Exame",
    prescription: "Receita",
    evolution: "Evolução",
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prontuários e Anamneses</h1>
        
        <Dialog open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Prontuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Prontuário</DialogTitle>
              <DialogDescription>
                Preencha as informações do prontuário do paciente.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="patient" className="text-sm font-medium">
                  Paciente
                </label>
                <select 
                  id="patient"
                  className="w-full p-2 border rounded-md"
                  value={selectedPatient?.id || ""}
                  onChange={(e) => {
                    const patient = patients?.find(p => p.id === e.target.value);
                    setSelectedPatient(patient || null);
                  }}
                >
                  <option value="" disabled>Selecione um paciente</option>
                  {patients?.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="recordType" className="text-sm font-medium">
                  Tipo de Prontuário
                </label>
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
                <label htmlFor="content" className="text-sm font-medium">
                  Conteúdo
                </label>
                <textarea
                  id="content"
                  className="w-full p-2 border rounded-md min-h-[200px]"
                  value={recordContent}
                  onChange={(e) => setRecordContent(e.target.value)}
                  placeholder="Digite o conteúdo do prontuário"
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
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar prontuários..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="anamnesis">Anamnese</TabsTrigger>
            <TabsTrigger value="consultation">Consulta</TabsTrigger>
            <TabsTrigger value="exam">Exame</TabsTrigger>
            <TabsTrigger value="prescription">Receita</TabsTrigger>
            <TabsTrigger value="evolution">Evolução</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {recordsLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Carregando prontuários...</p>
        </div>
      ) : records && records.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => (
            <Card key={record.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => viewRecordDetails(record)}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-lg">{recordTypeDisplay[record.record_type]}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        viewRecordDetails(record);
                      }}>
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500" onClick={(e) => {
                        e.stopPropagation();
                        // Handle delete functionality
                      }}>
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>{record.patient_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(record.created_at)}</span>
                  </div>
                  <p className="text-sm line-clamp-3">{record.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-600">Nenhum prontuário encontrado</h3>
          <p className="text-gray-500 mt-1">
            {searchQuery ? 'Tente uma busca diferente' : 'Crie seu primeiro prontuário clicando no botão "Novo Prontuário"'}
          </p>
        </div>
      )}
    </div>
  );
}
