
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { usePatientData } from "./use-patient-data";
import { usePatientRecordsData } from "./use-patient-records-data";
import { renderPatientSectionContent } from "@/utils/patientSectionContent";
import { Patient } from "@/types/patient";

export const usePatientRecords = (patientId?: string) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [editPatientData, setEditPatientData] = useState<Patient | null>(null);

  const { 
    patient, 
    patientLoading, 
    updatePatient: updatePatientData 
  } = usePatientData(patientId);

  const { 
    records, 
    recordsLoading, 
    createRecord 
  } = usePatientRecordsData(patientId, activeTab);

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
    updatePatient,
    renderSectionContent: (sectionId, patientId) => renderPatientSectionContent(sectionId, patientId)
  };
};
