
import React, { useState, KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { usePatientRecordsData } from "@/hooks/use-patient-records-data";
import { MedicationItem } from "@/types/medication";
import { MedicationCard } from "./MedicationCard";
import { DeleteMedicationDialog } from "./DeleteMedicationDialog";

interface MedicationsSectionProps {
  patientId?: string;
}

export const MedicationsSection = ({ patientId }: MedicationsSectionProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newMedication, setNewMedication] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [medInstructions, setMedInstructions] = useState("");
  const [medicationToDelete, setMedicationToDelete] = useState<string | null>(null);
  
  const { 
    records: medications, 
    recordsLoading, 
    createRecord, 
    deleteRecord 
  } = usePatientRecordsData(patientId, "medicacao");

  const resetForm = () => {
    setNewMedication("");
    setMedDosage("");
    setMedInstructions("");
  };

  const handleAddMedication = async () => {
    if (!newMedication.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Nome da medicação é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    const medicationData = {
      name: newMedication,
      dosage: medDosage,
      instructions: medInstructions
    };

    try {
      await createRecord(JSON.stringify(medicationData), "medicacao");
      resetForm();
      
      toast({
        title: "Medicação adicionada",
        description: "A medicação foi adicionada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao adicionar medicação:", error);
      toast({
        title: "Erro ao adicionar medicação",
        description: "Houve um erro ao adicionar a medicação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddMedication();
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

  // Parser function to handle different medication data formats
  const parseMedicationData = (med: any): MedicationItem => {
    try {
      if (typeof med.content === 'string') {
        return {
          ...JSON.parse(med.content),
          id: med.id,
          created_at: med.created_at
        };
      }
    } catch (e) {
      // Fallback for old format
    }
    
    return {
      id: med.id,
      name: med.content,
      created_at: med.created_at
    };
  };

  return (
    <div className="space-y-4">
      {/* Medications List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Medicações registradas</h3>
        {recordsLoading ? (
          <p className="text-sm text-gray-500">Carregando medicações...</p>
        ) : medications && medications.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {medications.map((med) => {
              const medicationData = parseMedicationData(med);
              return (
                <MedicationCard 
                  key={med.id} 
                  medication={medicationData}
                  onDelete={(id) => setMedicationToDelete(id)}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Nenhuma medicação registrada</p>
        )}
      </div>

      {/* Inline Add Medication Form */}
      {showForm ? (
        <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Nova medicação</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => setShowForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Input 
              placeholder="Nome da medicação" 
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-sm"
              autoFocus
            />
            <div className="grid grid-cols-2 gap-2">
              <Input 
                placeholder="Dosagem (opcional)" 
                value={medDosage}
                onChange={(e) => setMedDosage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-sm"
              />
              <Input 
                placeholder="Posologia (opcional)" 
                value={medInstructions}
                onChange={(e) => setMedInstructions(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-sm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button 
                size="sm"
                onClick={handleAddMedication}
                disabled={!newMedication.trim()}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
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
