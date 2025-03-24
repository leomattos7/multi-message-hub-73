
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMedications } from "@/hooks/useMedications";
import { AddMedicationForm } from "./AddMedicationForm";
import { MedicationsList } from "./MedicationsList";
import { DeleteMedicationDialog } from "./DeleteMedicationDialog";
import { parseMedicationData } from "./medicationUtils";

interface MedicationsSectionProps {
  patientId?: string;
}

export const MedicationsSection = ({ patientId }: MedicationsSectionProps) => {
  const [showForm, setShowForm] = useState(false);
  
  const {
    medications,
    isLoading,
    medicationToDelete,
    setMedicationToDelete,
    addMedication,
    deleteMedication
  } = useMedications(patientId);

  return (
    <div className="space-y-4">
      {/* Medications List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Medicações registradas</h3>
        <MedicationsList 
          medications={medications || []}
          isLoading={isLoading}
          onDelete={(id) => setMedicationToDelete(id)}
          parseMedicationData={parseMedicationData}
        />
      </div>

      {/* Inline Add Medication Form */}
      {showForm ? (
        <AddMedicationForm 
          onAddMedication={addMedication}
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
        onDelete={deleteMedication}
      />
    </div>
  );
};
