
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { usePatientRecordsData } from "../use-patient-records-data";
import { SoapNotes } from "@/components/patient/soap/SoapNotesForm";

export const useRecordOperations = (patientId?: string, activeTab: string = "today") => {
  const [isSavingConsultation, setIsSavingConsultation] = useState(false);
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);

  const { createRecord } = usePatientRecordsData(patientId, activeTab === "today" ? "" : "");

  const createNewRecord = async (content: string, type: string) => {
    try {
      await createRecord(content, type);
      
      toast({
        title: "Prontuário criado",
        description: "O prontuário foi criado com sucesso.",
      });
      
      setIsNewRecordOpen(false);
      return true;
    } catch (error) {
      console.error("Error creating record:", error);
      toast({
        title: "Erro ao criar prontuário",
        description: "Houve um erro ao criar o prontuário. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const saveConsultation = async (notes: SoapNotes) => {
    setIsSavingConsultation(true);
    try {
      // Format the plan section based on the new structure
      const planContent = [
        notes.plan.prescriptions && `**Receitas:**\n${notes.plan.prescriptions}`,
        notes.plan.certificates && `**Atestados:**\n${notes.plan.certificates}`,
        notes.plan.guidance && `**Orientações:**\n${notes.plan.guidance}`,
        notes.plan.tasks && `**Tarefas:**\n${notes.plan.tasks}`,
        notes.plan.exams && `**Exames:**\n${notes.plan.exams}`
      ].filter(Boolean).join('\n\n');

      const formattedContent = `
**Subjetivo:**
${notes.subjective || "Não informado"}

**Objetivo:**
${notes.objective || "Não informado"}

**Avaliação:**
${notes.assessment || "Não informado"}

**Plano:**
${planContent || "Não informado"}
      `.trim();

      await createRecord(formattedContent, "soap");
      
      toast({
        title: "Consulta salva",
        description: "A consulta SOAP foi salva com sucesso.",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving consultation:", error);
      toast({
        title: "Erro ao salvar consulta",
        description: "Houve um erro ao salvar a consulta SOAP. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSavingConsultation(false);
    }
  };

  return {
    isNewRecordOpen,
    setIsNewRecordOpen,
    isSavingConsultation,
    createNewRecord,
    saveConsultation
  };
};
