
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { PatientSummaryItemType } from "@/components/PatientSummaryItem";
import { MedicalRecord } from "@/components/medical-record/types";

export const useMedicalRecord = (id: string | undefined) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Define initial order of patient summary items
  const [summaryItems, setSummaryItems] = useState<PatientSummaryItemType[]>([
    "medications",
    "problems",
    "exams",
    "medications", // This is duplicated in the requirements, maybe it should be another type?
    "personalHistory",
    "familyHistory"
  ]);

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(summaryItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSummaryItems(items);
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

  // Handle back button navigation
  const handleBackNavigation = () => {
    if (record && record.patient_id) {
      // Navigate to the patient's page instead of the general records list
      navigate(`/prontuarios/paciente/${record.patient_id}`);
    } else {
      // Fallback to general records list if patient ID is not available
      navigate("/prontuarios");
    }
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

  return {
    record,
    isLoading,
    isEditing,
    setIsEditing,
    editedContent,
    setEditedContent,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    summaryItems,
    handleDragEnd,
    handleBackNavigation,
    handleSave,
    handleDelete,
  };
};
