
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { usePatientData } from "../use-patient-data";
import { Patient } from "@/types/patient";

export const usePatientOperations = (patientId?: string) => {
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [editPatientData, setEditPatientData] = useState<Patient | null>(null);

  const { 
    patient, 
    patientLoading, 
    updatePatient: updatePatientData 
  } = usePatientData(patientId);

  const handleEditPatient = () => {
    if (patient) {
      setEditPatientData({ ...patient });
      setIsEditPatientOpen(true);
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
        return false;
      }

      await updatePatientData(updatedPatient);
      
      toast({
        title: "Paciente atualizado",
        description: "Os dados do paciente foram atualizados com sucesso.",
      });

      setIsEditPatientOpen(false);
      return true;
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Erro ao atualizar paciente",
        description: "Houve um erro ao atualizar os dados do paciente. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    patient,
    patientLoading,
    isEditPatientOpen,
    setIsEditPatientOpen,
    editPatientData,
    setEditPatientData,
    handleEditPatient,
    updatePatient
  };
};
