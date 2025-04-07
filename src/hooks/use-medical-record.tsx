
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface MedicalRecordWithPatient {
  id: string;
  patient_id: string;
  record_date: string;
  record_type: string;
  content: string;
  created_at: string;
  updated_at: string;
  patient: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
}

export const useMedicalRecord = (recordId?: string) => {
  const [record, setRecord] = useState<MedicalRecordWithPatient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecord = async () => {
      if (!recordId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // First, fetch the record
        const { data: recordData, error: recordError } = await supabase
          .from("patient_records")
          .select(`*`)
          .eq("id", recordId)
          .single();

        if (recordError) throw recordError;
        
        // Then fetch the patient separately
        const { data: patientData, error: patientError } = await supabase
          .from("patients")
          .select(`id, name, email, phone`)
          .eq("id", recordData.patient_id)
          .single();
        
        if (patientError) {
          // If there's an error fetching the patient, create a fallback patient object
          const fallbackPatient = {
            id: recordData.patient_id,
            name: "Nome não disponível",
            email: "",
            phone: ""
          };
          
          const completeRecord: MedicalRecordWithPatient = {
            ...recordData,
            patient: fallbackPatient
          };
          
          setRecord(completeRecord);
          setEditedContent(completeRecord.content);
          
          console.error("Error fetching patient data:", patientError);
          return;
        }
        
        // Combine the data
        const completeRecord: MedicalRecordWithPatient = {
          ...recordData,
          patient: patientData
        };
        
        setRecord(completeRecord);
        setEditedContent(completeRecord.content);
      } catch (error) {
        console.error("Error fetching record:", error);
        toast({
          title: "Erro ao carregar prontuário",
          description: "Não foi possível carregar os dados do prontuário.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [recordId]);

  const handleBackNavigation = () => {
    if (record) {
      navigate(`/prontuarios/paciente/${record.patient_id}`);
    } else {
      navigate("/prontuarios");
    }
  };

  const handleSave = async () => {
    if (!record || !editedContent.trim()) return;

    try {
      const { error } = await supabase
        .from("patient_records")
        .update({ content: editedContent, updated_at: new Date().toISOString() })
        .eq("id", record.id);

      if (error) throw error;

      setRecord({
        ...record,
        content: editedContent,
        updated_at: new Date().toISOString(),
      });
      
      setIsEditing(false);
      
      toast({
        title: "Prontuário atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Error updating record:", error);
      toast({
        title: "Erro ao atualizar prontuário",
        description: "Não foi possível salvar as alterações no prontuário.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!record) return;

    const confirmed = window.confirm("Tem certeza que deseja excluir este prontuário? Esta ação não pode ser desfeita.");
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("patient_records")
        .delete()
        .eq("id", record.id);

      if (error) throw error;

      toast({
        title: "Prontuário excluído",
        description: "O prontuário foi excluído com sucesso.",
      });
      
      handleBackNavigation();
    } catch (error) {
      console.error("Error deleting record:", error);
      toast({
        title: "Erro ao excluir prontuário",
        description: "Não foi possível excluir o prontuário.",
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
