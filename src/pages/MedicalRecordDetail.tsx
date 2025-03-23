
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Info
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "@/components/ui/use-toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Define interfaces for our data
interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  biological_sex?: string;
  gender_identity?: string;
}

interface MedicalRecord {
  id: string;
  patient_id: string;
  patient?: Patient;
  record_date: string;
  record_type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function MedicalRecordDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Record type display mapping
  const recordTypeDisplay: Record<string, string> = {
    anamnesis: "Anamnese",
    consultation: "Consulta",
    exam: "Exame",
    prescription: "Receita",
    evolution: "Evolução",
  };

  // Fetch record details
  const { data: record, isLoading, refetch } = useQuery({
    queryKey: ["medical-record", id],
    queryFn: async () => {
      if (!id) throw new Error("Record ID is required");

      // First fetch the medical record
      const { data: recordData, error: recordError } = await supabase
        .from("patient_records")
        .select("*")
        .eq("id", id)
        .single();

      if (recordError) throw recordError;
      
      // Then fetch the associated patient
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("id, name, email, phone, birth_date, biological_sex, gender_identity")
        .eq("id", recordData.patient_id)
        .single();

      if (patientError) throw patientError;
      
      // Set the initial edited content
      setEditedContent(recordData.content);
      
      // Combine the data
      return {
        ...recordData,
        patient: patientData
      } as MedicalRecord;
    }
  });

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

  // Format birth date for display
  const formatBirthDate = (birthDate: string | undefined): string => {
    if (!birthDate) return 'Não informado';
    
    const date = new Date(birthDate);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Handle record update
  const handleSave = async () => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from("patient_records")
        .update({
          content: editedContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      setIsEditing(false);
      refetch();
      
      toast({
        title: "Prontuário atualizado",
        description: "O prontuário foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating record:", error);
      toast({
        title: "Erro ao atualizar prontuário",
        description: "Houve um erro ao atualizar o prontuário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Handle back button navigation - MODIFIED TO GO TO PATIENT PAGE
  const handleBackNavigation = () => {
    if (record && record.patient_id) {
      // Navigate to the patient's page instead of the general records list
      navigate(`/prontuarios/paciente/${record.patient_id}`);
    } else {
      // Fallback to general records list if patient ID is not available
      navigate("/prontuarios");
    }
  };

  // Handle record deletion
  const handleDelete = async () => {
    if (!id || !record) return;
    
    const patientId = record.patient_id;

    try {
      const { error } = await supabase
        .from("patient_records")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Prontuário excluído",
        description: "O prontuário foi excluído com sucesso.",
      });

      // Navigate to the patient's page after deletion instead of general records list
      navigate(`/prontuarios/paciente/${patientId}`);
    } catch (error) {
      console.error("Error deleting record:", error);
      toast({
        title: "Erro ao excluir prontuário",
        description: "Houve um erro ao excluir o prontuário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <p>Carregando prontuário...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/prontuarios")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-600">Prontuário não encontrado</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBackNavigation} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          {/* Título com nome do paciente e ícone de informações */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-2">{record.patient?.name}</h1>
            
            {/* Ícone de informações com HoverCard */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-5 w-5 text-blue-500" />
                  <span className="sr-only">Informações adicionais</span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Informações Pessoais</h4>
                  <div className="flex justify-between">
                    <span className="text-sm">Idade:</span>
                    <span className="text-sm font-medium">
                      {record.patient?.birth_date ? `${calculateAge(record.patient.birth_date)} anos` : 'Não informado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Data de Nascimento:</span>
                    <span className="text-sm font-medium">{formatBirthDate(record.patient?.birth_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sexo Biológico:</span>
                    <span className="text-sm font-medium">
                      {record.patient?.biological_sex === 'male' ? 'Masculino' : 
                       record.patient?.biological_sex === 'female' ? 'Feminino' : 
                       record.patient?.biological_sex === 'intersex' ? 'Intersexo' : 'Não informado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Identidade de Gênero:</span>
                    <span className="text-sm font-medium">
                      {record.patient?.gender_identity === 'man' ? 'Homem' : 
                       record.patient?.gender_identity === 'woman' ? 'Mulher' : 
                       record.patient?.gender_identity === 'non_binary' ? 'Não-Binário' : 
                       record.patient?.gender_identity === 'other' ? 'Outro' : 'Não informado'}
                    </span>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={() => {
                setIsEditing(false);
                setEditedContent(record.content);
              }}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir prontuário</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir este prontuário? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Paciente</h3>
                  <div className="mt-1 flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="font-medium">{record.patient?.name}</p>
                  </div>
                </div>
                
                {record.patient?.email && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p>{record.patient.email}</p>
                  </div>
                )}
                
                {record.patient?.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                    <p>{record.patient.phone}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Criado em</h3>
                  <div className="mt-1 flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <p>{formatDate(record.created_at)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Última atualização</h3>
                  <div className="mt-1 flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <p>{formatDate(record.updated_at)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tipo de prontuário</h3>
                  <div className="mt-1 flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <p>{recordTypeDisplay[record.record_type]}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Conteúdo</h2>
              
              {isEditing ? (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[300px]"
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg min-h-[300px] whitespace-pre-wrap">
                  {record.content}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
