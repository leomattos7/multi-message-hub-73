
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
  X 
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

      const { data, error } = await supabase
        .from("patient_records")
        .select(`
          id, 
          patient_id, 
          record_date, 
          record_type, 
          content, 
          created_at, 
          updated_at,
          patients(id, name, email, phone)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      
      // Set the initial edited content
      setEditedContent(data.content);
      
      return {
        id: data.id,
        patient_id: data.patient_id,
        patient: data.patients,
        record_date: data.record_date,
        record_type: data.record_type,
        content: data.content,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
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

  // Handle record deletion
  const handleDelete = async () => {
    if (!id) return;

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

      navigate("/prontuarios");
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
          <Button variant="ghost" onClick={() => navigate("/prontuarios")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">{recordTypeDisplay[record.record_type]}</h1>
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
