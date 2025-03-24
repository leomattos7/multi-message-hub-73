
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { usePatientRecordsData } from "@/hooks/use-patient-records-data";
import { MedicationItem } from "@/types/medication";
import { parseMedicationData } from "@/components/patient/medications/medicationUtils";

export function useMedications(patientId?: string) {
  const [medicationToDelete, setMedicationToDelete] = useState<string | null>(null);
  
  const { 
    records: medications, 
    recordsLoading, 
    createRecord, 
    deleteRecord 
  } = usePatientRecordsData(patientId, "medicacao");

  const handleAddMedication = async (medicationName: string) => {
    const medicationData = {
      name: medicationName
    };

    try {
      await createRecord(JSON.stringify(medicationData), "medicacao");
      
      toast({
        title: "Medicação adicionada",
        description: "A medicação foi adicionada com sucesso.",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Erro ao adicionar medicação:", error);
      toast({
        title: "Erro ao adicionar medicação",
        description: "Houve um erro ao adicionar a medicação. Tente novamente.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };

  const handleDeleteMedication = async () => {
    if (!medicationToDelete) return;
    
    try {
      await deleteRecord(medicationToDelete);
      
      toast({
        title: "Medicação removida",
        description: "A medicação foi removida com sucesso.",
      });
      
      setMedicationToDelete(null);
    } catch (error) {
      console.error("Erro ao remover medicação:", error);
      toast({
        title: "Erro ao remover medicação",
        description: "Houve um erro ao remover a medicação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getMedicationsList = () => {
    if (!medications) return [];
    
    return medications.map((med) => parseMedicationData(med));
  };

  return {
    medications: getMedicationsList(),
    isLoading: recordsLoading,
    medicationToDelete,
    setMedicationToDelete,
    addMedication: handleAddMedication,
    deleteMedication: handleDeleteMedication
  };
}
