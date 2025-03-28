
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LabExam } from "@/types/labExam";
import { Button } from "@/components/ui/button";
import { Plus, TestTube } from "lucide-react";
import { LabExamCard } from "./LabExamCard";
import { LabExamDialog } from "./LabExamDialog";
import { DeleteLabExamDialog } from "./DeleteLabExamDialog";
import { useToast } from "@/hooks/use-toast";

interface LabExamsSectionProps {
  patientId?: string;
}

export const LabExamsSection = ({ patientId }: LabExamsSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch lab exams for the patient
  const { data: exams, isLoading } = useQuery({
    queryKey: ["lab-exams", patientId],
    queryFn: async () => {
      if (!patientId) return [];
      
      const { data, error } = await supabase
        .from("lab_exams")
        .select("*")
        .eq("patient_id", patientId)
        .order("exam_date", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data as LabExam[];
    },
    enabled: !!patientId,
  });

  // Mutation to add a new lab exam
  const addExamMutation = useMutation({
    mutationFn: async (examData: Omit<LabExam, "id" | "created_at" | "patient_id">) => {
      if (!patientId) throw new Error("Patient ID is required");
      
      const { data, error } = await supabase
        .from("lab_exams")
        .insert({
          ...examData,
          patient_id: patientId,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-exams", patientId] });
      setIsDialogOpen(false);
      toast({
        title: "Exame adicionado",
        description: "O exame foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Error adding lab exam:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o exame.",
        variant: "destructive",
      });
    },
  });

  // Mutation to delete a lab exam
  const deleteExamMutation = useMutation({
    mutationFn: async (examId: string) => {
      if (!patientId) throw new Error("Patient ID is required");
      
      const { error } = await supabase
        .from("lab_exams")
        .delete()
        .eq("id", examId)
        .eq("patient_id", patientId);
        
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-exams", patientId] });
      setExamToDelete(null);
      toast({
        title: "Exame removido",
        description: "O exame foi removido com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Error deleting lab exam:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o exame.",
        variant: "destructive",
      });
    },
  });

  const handleAddExam = (examData: Omit<LabExam, "id" | "created_at" | "patient_id">) => {
    addExamMutation.mutate(examData);
  };

  const handleDeleteExam = (examId: string) => {
    setExamToDelete(examId);
  };

  const confirmDeleteExam = () => {
    if (examToDelete) {
      deleteExamMutation.mutate(examToDelete);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1">
          <TestTube size={16} />
          <h3 className="text-sm font-medium">Últimos exames</h3>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 flex items-center gap-1"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus size={16} />
          <span className="text-xs">Adicionar</span>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Carregando exames...</p>
      ) : exams && exams.length > 0 ? (
        <div>
          {exams.map((exam) => (
            <LabExamCard
              key={exam.id}
              exam={exam}
              onDelete={handleDeleteExam}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Nenhum exame registrado
        </p>
      )}

      <LabExamDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={handleAddExam}
      />

      <DeleteLabExamDialog
        isOpen={!!examToDelete}
        onOpenChange={(open) => !open && setExamToDelete(null)}
        onConfirm={confirmDeleteExam}
      />
    </div>
  );
};
