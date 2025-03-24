
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { usePatientData } from "./use-patient-data";
import { usePatientRecordsData } from "./use-patient-records-data";
import { renderPatientSectionContent } from "@/utils/patientSectionContent";
import { Patient } from "@/types/patient";
import { SoapNotes } from "@/components/patient/SoapNotesForm";

export const usePatientRecords = (patientId?: string) => {
  const [activeTab, setActiveTab] = useState<string>("today");
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [editPatientData, setEditPatientData] = useState<Patient | null>(null);
  const [isSavingConsultation, setIsSavingConsultation] = useState(false);

  const { 
    patient, 
    patientLoading, 
    updatePatient: updatePatientData 
  } = usePatientData(patientId);

  const { 
    records, 
    recordsLoading, 
    createRecord 
  } = usePatientRecordsData(patientId, activeTab === "today" ? "" : "");

  const handleEditPatient = () => {
    if (patient) {
      setEditPatientData({ ...patient });
      setIsEditPatientOpen(true);
    }
  };

  const createNewRecord = async (content: string, type: string) => {
    try {
      await createRecord(content, type);
      
      toast({
        title: "Prontuário criado",
        description: "O prontuário foi criado com sucesso.",
      });
      
      // Switch to today tab when creating a new record
      setActiveTab("today");
      setIsNewRecordOpen(false);
    } catch (error) {
      console.error("Error creating record:", error);
      toast({
        title: "Erro ao criar prontuário",
        description: "Houve um erro ao criar o prontuário. Tente novamente.",
        variant: "destructive",
      });
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
        notes.plan.tasks && `**Tarefas:**\n${notes.plan.tasks}`
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
      
      // Switch to history tab after saving
      setActiveTab("history");
    } catch (error) {
      console.error("Error saving consultation:", error);
      toast({
        title: "Erro ao salvar consulta",
        description: "Houve um erro ao salvar a consulta SOAP. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSavingConsultation(false);
    }
  };

  const updatePatient = async (updatedPatient: Patient) => {
    try {
      if (!updatedPatient.name.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O nome do paciente é obrigatório.",
          variant: "destructive",
        });
        return;
      }

      await updatePatientData(updatedPatient);
      
      toast({
        title: "Paciente atualizado",
        description: "Os dados do paciente foram atualizados com sucesso.",
      });

      setIsEditPatientOpen(false);
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Erro ao atualizar paciente",
        description: "Houve um erro ao atualizar os dados do paciente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    patient,
    records,
    patientLoading,
    recordsLoading,
    activeTab,
    setActiveTab,
    isNewRecordOpen,
    setIsNewRecordOpen,
    isEditPatientOpen,
    setIsEditPatientOpen,
    editPatientData,
    setEditPatientData,
    handleEditPatient,
    createNewRecord,
    saveConsultation,
    isSavingConsultation,
    updatePatient,
    renderSectionContent: (sectionId, patientId) => renderPatientSectionContent(sectionId, patientId)
  };
};
