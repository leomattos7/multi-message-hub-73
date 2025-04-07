
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { usePatientRecordsData } from "@/hooks/use-patient-records-data";
import { MedicalHistoryCard } from "./MedicalHistoryCard";
import { MedicalHistoryDialog } from "./MedicalHistoryDialog";
import { DeleteMedicalHistoryDialog } from "./DeleteMedicalHistoryDialog";
import { MedicalHistoryItem } from "@/types/medicalHistory";

interface MedicalHistorySectionProps {
  patientId?: string;
}

export const MedicalHistorySection = ({ patientId }: MedicalHistorySectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [medicalHistoryToEdit, setMedicalHistoryToEdit] = useState<MedicalHistoryItem | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  
  const { 
    records: medicalHistory, 
    recordsLoading, 
    createRecord,
    updateRecord,
    deleteRecord 
  } = usePatientRecordsData(patientId, "antecedente_pessoal");

  const handleSaveMedicalHistory = async (medicalHistoryData: Partial<MedicalHistoryItem>) => {
    try {
      if (medicalHistoryData.id) {
        // Update existing medical history
        await updateRecord(medicalHistoryData.id, JSON.stringify(medicalHistoryData));
        
        toast({
          title: "Antecedente atualizado",
          description: "O antecedente pessoal foi atualizado com sucesso.",
        });
      } else {
        // Add new medical history
        await createRecord(JSON.stringify(medicalHistoryData), "antecedente_pessoal");
        
        toast({
          title: "Antecedente adicionado",
          description: "O antecedente pessoal foi adicionado com sucesso.",
        });
      }
      
      setMedicalHistoryToEdit(null);
    } catch (error) {
      console.error("Erro ao salvar antecedente pessoal:", error);
      toast({
        title: "Erro ao salvar antecedente",
        description: "Houve um erro ao salvar o antecedente pessoal. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRecord = async () => {
    if (!recordToDelete) return;
    
    try {
      await deleteRecord(recordToDelete);
      
      toast({
        title: "Antecedente removido",
        description: "O antecedente pessoal foi removido com sucesso.",
      });
      
      setRecordToDelete(null);
    } catch (error) {
      console.error("Erro ao remover antecedente pessoal:", error);
      toast({
        title: "Erro ao remover antecedente",
        description: "Houve um erro ao remover o antecedente pessoal. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditMedicalHistory = (medicalHistory: MedicalHistoryItem) => {
    setMedicalHistoryToEdit(medicalHistory);
    setIsDialogOpen(true);
  };

  // Parser function to handle different data formats
  const parseRecordData = (record: any): MedicalHistoryItem => {
    try {
      if (typeof record.content === 'string') {
        return {
          ...JSON.parse(record.content),
          id: record.id,
          created_at: record.created_at
        };
      }
    } catch (e) {
      // Fallback for old format
    }
    
    return {
      id: record.id,
      description: record.content,
      created_at: record.created_at
    };
  };

  return (
    <div className="space-y-4">
      {/* Medical History List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Histórico médico pessoal do paciente</h3>
        {recordsLoading ? (
          <p className="text-sm text-gray-500">Carregando antecedentes pessoais...</p>
        ) : medicalHistory && medicalHistory.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {medicalHistory.map((record) => {
              const historyData = parseRecordData(record);
              return (
                <MedicalHistoryCard 
                  key={record.id} 
                  medicalHistory={historyData}
                  onDelete={(id) => setRecordToDelete(id)}
                  onEdit={handleEditMedicalHistory}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Nenhum antecedente pessoal registrado</p>
        )}
      </div>

      {/* Add Record Button */}
      <div className="flex justify-center">
        <Button 
          onClick={() => {
            setMedicalHistoryToEdit(null);
            setIsDialogOpen(true);
          }} 
          size="sm"
          className="rounded-full h-10 w-10 p-0 bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Add/Edit Medical History Dialog */}
      <MedicalHistoryDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        medicalHistory={medicalHistoryToEdit || undefined}
        title={medicalHistoryToEdit ? "Editar antecedente pessoal" : "Adicionar antecedente pessoal"}
        onSave={handleSaveMedicalHistory}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteMedicalHistoryDialog
        isOpen={!!recordToDelete}
        onOpenChange={() => setRecordToDelete(null)}
        onDelete={handleDeleteRecord}
      />
    </div>
  );
};
