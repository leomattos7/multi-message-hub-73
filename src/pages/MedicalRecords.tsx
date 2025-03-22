
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Plus, 
  FileText, 
  Users,
  User, 
  ChevronRight,
  Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define patient interface
interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  payment_method?: string;
  insurance_name?: string;
  record_count?: number;
  birth_date?: string;
  biological_sex?: string;
  gender_identity?: string;
}

// Define record summary interface
interface RecordSummary {
  record_type: string;
  count: number;
}

export default function MedicalRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    payment_method: "particular",
    insurance_name: "",
    birth_date: "",
    biological_sex: "",
    gender_identity: ""
  });
  const navigate = useNavigate();

  // Fetch patients with record counts
  const { data: patients, isLoading: patientsLoading, refetch: refetchPatients } = useQuery({
    queryKey: ["patients", searchQuery],
    queryFn: async () => {
      // First get all patients
      let query = supabase
        .from("patients")
        .select("id, name, email, phone, address, notes, payment_method, insurance_name, birth_date, biological_sex, gender_identity");
      
      // Apply search filter if provided
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
      }
      
      const { data: patientsData, error: patientsError } = await query.order("name");
      
      if (patientsError) throw patientsError;
      
      // For each patient, get their record counts
      const patientsWithRecordCounts = await Promise.all(patientsData.map(async (patient) => {
        const { count, error: countError } = await supabase
          .from("patient_records")
          .select("*", { count: "exact", head: true })
          .eq("patient_id", patient.id);
          
        if (countError) {
          console.error("Error fetching record count:", countError);
          return { ...patient, record_count: 0 };
        }
        
        return { ...patient, record_count: count || 0 };
      }));
      
      return patientsWithRecordCounts as Patient[];
    }
  });

  // Get record type summary
  const { data: recordSummary } = useQuery({
    queryKey: ["record-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_records")
        .select("record_type");
        
      if (error) throw error;
      
      // Count occurrences of each record type
      const counts: Record<string, number> = {};
      data.forEach(record => {
        counts[record.record_type] = (counts[record.record_type] || 0) + 1;
      });
      
      // Convert to array
      return Object.entries(counts).map(([record_type, count]) => ({
        record_type,
        count
      })) as RecordSummary[];
    }
  });

  // Handle creating a new patient
  const handleAddPatient = async () => {
    if (!newPatient.name) {
      toast({
        title: "Campo obrigatório",
        description: "O nome do paciente é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patients")
        .insert({
          name: newPatient.name,
          email: newPatient.email || null,
          phone: newPatient.phone || null,
          address: newPatient.address || null,
          notes: newPatient.notes || null,
          payment_method: newPatient.payment_method || "particular",
          insurance_name: newPatient.payment_method === "convenio" ? newPatient.insurance_name || null : null,
          birth_date: newPatient.birth_date || null,
          biological_sex: newPatient.biological_sex || null,
          gender_identity: newPatient.gender_identity || null
        })
        .select();

      if (error) throw error;

      toast({
        title: "Paciente adicionado",
        description: "O paciente foi adicionado com sucesso.",
      });

      // Reset form and close dialog
      setNewPatient({
        name: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
        payment_method: "particular",
        insurance_name: "",
        birth_date: "",
        biological_sex: "",
        gender_identity: ""
      });
      setIsAddPatientOpen(false);
      
      // Refetch patients to update the list
      refetchPatients();
      
      // Navigate to the new patient's record page
      if (data && data.length > 0) {
        navigate(`/prontuarios/paciente/${data[0].id}`);
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      toast({
        title: "Erro ao adicionar paciente",
        description: "Houve um erro ao adicionar o paciente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Function to view a patient's records
  const viewPatientRecords = (patient: Patient) => {
    navigate(`/prontuarios/paciente/${patient.id}`);
  };

  // Get count of a specific record type
  const getRecordTypeCount = (type: string): number => {
    if (!recordSummary) return 0;
    const found = recordSummary.find(r => r.record_type === type);
    return found ? found.count : 0;
  };

  // Get total record count
  const getTotalRecordCount = (): number => {
    if (!recordSummary) return 0;
    return recordSummary.reduce((sum, r) => sum + r.count, 0);
  };

  // Calculate age from birth date
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prontuário Eletrônico</h1>
        
        <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Paciente</DialogTitle>
              <DialogDescription>
                Preencha as informações do paciente para criar um novo prontuário.
              </DialogDescription>
            </DialogHeader>
          
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo*</Label>
                <Input
                  id="name"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  placeholder="Digite o nome do paciente"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birth_date">Data de Nascimento</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={newPatient.birth_date}
                  onChange={(e) => setNewPatient({...newPatient, birth_date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="biological_sex">Sexo Biológico</Label>
                <Select
                  value={newPatient.biological_sex}
                  onValueChange={(value) => setNewPatient({...newPatient, biological_sex: value})}
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
                  value={newPatient.gender_identity}
                  onValueChange={(value) => setNewPatient({...newPatient, gender_identity: value})}
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
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                  placeholder="Digite o email do paciente"
                />
              </div>
            
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                  placeholder="Digite o telefone do paciente"
                />
              </div>
            
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                  placeholder="Digite o endereço do paciente"
                />
              </div>
            
              <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
                <RadioGroup 
                  value={newPatient.payment_method} 
                  onValueChange={(value) => setNewPatient({...newPatient, payment_method: value})}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="particular" id="particular" />
                    <Label htmlFor="particular">Particular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="convenio" id="convenio" />
                    <Label htmlFor="convenio">Convênio</Label>
                  </div>
                </RadioGroup>
              </div>
            
              {newPatient.payment_method === "convenio" && (
                <div className="space-y-2">
                  <Label htmlFor="insurance_name">Nome do Convênio</Label>
                  <Input
                    id="insurance_name"
                    value={newPatient.insurance_name}
                    onChange={(e) => setNewPatient({...newPatient, insurance_name: e.target.value})}
                    placeholder="Digite o nome do convênio"
                  />
                </div>
              )}
            
              <div className="space-y-2">
                <Label htmlFor="notes">Anotações</Label>
                <Textarea
                  id="notes"
                  value={newPatient.notes}
                  onChange={(e) => setNewPatient({...newPatient, notes: e.target.value})}
                  placeholder="Informações adicionais sobre o paciente"
                />
              </div>
            </div>
          
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddPatient}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="col-span-1 p-4 flex flex-col space-y-2">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            <h3 className="font-medium">Total de Pacientes</h3>
          </div>
          <p className="text-2xl font-bold">{patients ? patients.length : 0}</p>
        </Card>
        
        <Card className="col-span-1 p-4 flex flex-col space-y-2">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-500" />
            <h3 className="font-medium">Total de Registros</h3>
          </div>
          <p className="text-2xl font-bold">{getTotalRecordCount()}</p>
        </Card>
        
        <Card className="col-span-1 p-4 flex flex-col space-y-2">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-orange-500" />
            <h3 className="font-medium">Anamneses</h3>
          </div>
          <p className="text-2xl font-bold">{getRecordTypeCount('anamnesis')}</p>
        </Card>
        
        <Card className="col-span-1 p-4 flex flex-col space-y-2">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-purple-500" />
            <h3 className="font-medium">Consultas</h3>
          </div>
          <p className="text-2xl font-bold">{getRecordTypeCount('consultation')}</p>
        </Card>
      </div>
      
      <div className="mb-6 flex">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar pacientes por nome, email ou telefone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {patientsLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Carregando pacientes...</p>
        </div>
      ) : patients && patients.length > 0 ? (
        <div className="space-y-3">
          {patients.map((patient) => (
            <Card 
              key={patient.id} 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => viewPatientRecords(patient)}
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-gray-500" />
                    <h3 className="font-medium">{patient.name}</h3>
                  </div>
                  
                  <div className="ml-7 text-sm text-gray-500 space-y-1 mt-1">
                    {patient.email && <p>{patient.email}</p>}
                    {patient.phone && <p>{patient.phone}</p>}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-4 text-right">
                    <span className="text-sm text-gray-500">Registros</span>
                    <p className="font-medium">{patient.record_count}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <Users className="h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-600">Nenhum paciente encontrado</h3>
          <p className="text-gray-500 mt-1">
            {searchQuery ? 'Tente uma busca diferente' : 'Adicione seu primeiro paciente clicando no botão "Novo Paciente"'}
          </p>
        </div>
      )}
    </div>
  );
}
