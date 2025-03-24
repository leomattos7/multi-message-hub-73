
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { usePatientRecordsData } from "@/hooks/use-patient-records-data";
import { AddMedicationForm } from "./AddMedicationForm";
import { MedicationsList } from "./MedicationsList";
import { DeleteMedicationDialog } from "./DeleteMedicationDialog";
import { parseMedicationData } from "./medicationUtils";

interface MedicationsSectionProps {
  patientId?: string;
}

export const MedicationsSection = ({ patientId }: MedicationsSectionProps) => {
  const [showForm, setShowForm] = useState(false);
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

  return (
    <div className="space-y-4">
      {/* Medications List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Medicações registradas</h3>
        <MedicationsList 
          medications={medications || []}
          isLoading={recordsLoading}
          onDelete={(id) => setMedicationToDelete(id)}
          parseMedicationData={parseMedicationData}
        />
      </div>

      {/* Inline Add Medication Form */}
      {showForm ? (
        <AddMedicationForm 
          onAddMedication={handleAddMedication}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="flex justify-center">
          <Button 
            onClick={() => setShowForm(true)} 
            size="sm"
            className="rounded-full h-10 w-10 p-0 bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteMedicationDialog
        isOpen={!!medicationToDelete}
        onOpenChange={() => setMedicationToDelete(null)}
        onDelete={handleDeleteMedication}
      />
    </div>
  );
};
