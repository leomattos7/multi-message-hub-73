
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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

export const useMedicalRecord = (recordId?: string) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const { data: record, isLoading, refetch } = useQuery({
    queryKey: ["medical-record", recordId],
    queryFn: async () => {
      if (!recordId) throw new Error("Record ID is required");

      const { data: recordData, error: recordError } = await supabase
        .from("patient_records")
        .select("*")
        .eq("id", recordId)
        .single();

      if (recordError) throw recordError;
      
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("id, name, email, phone, birth_date, biological_sex, gender_identity")
        .eq("id", recordData.patient_id)
        .single();

      if (patientError) throw patientError;
      
      setEditedContent(recordData.content);
      
      return {
        ...recordData,
        patient: patientData
      } as MedicalRecord;
    },
    enabled: !!recordId
  });

  const handleBackNavigation = () => {
    if (record && record.patient_id) {
      navigate(`/prontuarios/paciente/${record.patient_id}`);
    } else {
      navigate("/prontuarios");
    }
  };

  const handleSave = async () => {
    if (!recordId) return;

    try {
      const { error } = await supabase
        .from("patient_records")
        .update({
          content: editedContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", recordId);

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

  const handleDelete = async () => {
    if (!recordId || !record) return;
    
    const patientId = record.patient_id;

    try {
      const { error } = await supabase
        .from("patient_records")
        .delete()
        .eq("id", recordId);

      if (error) throw error;

      toast({
        title: "Prontuário excluído",
        description: "O prontuário foi excluído com sucesso.",
      });

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

  return {
    record,
    isLoading,
    isEditing,
    editedContent,
    setIsEditing,
    setEditedContent,
    handleBackNavigation,
    handleSave,
    handleDelete,
  };
};
