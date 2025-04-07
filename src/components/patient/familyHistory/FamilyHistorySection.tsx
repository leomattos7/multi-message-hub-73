
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { usePatientRecordsData } from "@/hooks/use-patient-records-data";
import { FamilyHistoryCard } from "./FamilyHistoryCard";
import { FamilyHistoryDialog } from "./FamilyHistoryDialog";
import { DeleteFamilyHistoryDialog } from "./DeleteFamilyHistoryDialog";
import { FamilyHistoryItem } from "@/types/familyHistory";

interface FamilyHistorySectionProps {
  patientId?: string;
}

export const FamilyHistorySection = ({ patientId }: FamilyHistorySectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [familyHistoryToEdit, setFamilyHistoryToEdit] = useState<FamilyHistoryItem | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  
  const { 
    records: familyHistory, 
    recordsLoading, 
    createRecord,
    updateRecord,
    deleteRecord 
  } = usePatientRecordsData(patientId, "historico_familiar");

  const handleSaveFamilyHistory = async (familyHistoryData: Partial<FamilyHistoryItem>) => {
    try {
      if (familyHistoryData.id) {
        // Update existing family history
        await updateRecord(familyHistoryData.id, JSON.stringify(familyHistoryData));
        
        toast({
          title: "Histórico atualizado",
          description: "O histórico familiar foi atualizado com sucesso.",
        });
      } else {
        // Add new family history
        await createRecord(JSON.stringify(familyHistoryData), "historico_familiar");
        
        toast({
          title: "Histórico adicionado",
          description: "O histórico familiar foi adicionado com sucesso.",
        });
      }
      
      setFamilyHistoryToEdit(null);
    } catch (error) {
      console.error("Erro ao salvar histórico familiar:", error);
      toast({
        title: "Erro ao salvar histórico",
        description: "Houve um erro ao salvar o histórico familiar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRecord = async () => {
    if (!recordToDelete) return;
    
    try {
      await deleteRecord(recordToDelete);
      
      toast({
        title: "Histórico removido",
        description: "O histórico familiar foi removido com sucesso.",
      });
      
      setRecordToDelete(null);
    } catch (error) {
      console.error("Erro ao remover histórico familiar:", error);
      toast({
        title: "Erro ao remover histórico",
        description: "Houve um erro ao remover o histórico familiar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditFamilyHistory = (familyHistory: FamilyHistoryItem) => {
    setFamilyHistoryToEdit(familyHistory);
    setIsDialogOpen(true);
  };

  // Parser function to handle different data formats
  const parseRecordData = (record: any): FamilyHistoryItem => {
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
      {/* Family History List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Histórico de doenças na família do paciente</h3>
        {recordsLoading ? (
          <p className="text-sm text-gray-500">Carregando histórico familiar...</p>
        ) : familyHistory && familyHistory.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {familyHistory.map((record) => {
              const historyData = parseRecordData(record);
              return (
                <FamilyHistoryCard 
                  key={record.id} 
                  familyHistory={historyData}
                  onDelete={(id) => setRecordToDelete(id)}
                  onEdit={handleEditFamilyHistory}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Nenhum histórico familiar registrado</p>
        )}
      </div>

      {/* Add Record Button */}
      <div className="flex justify-center">
        <Button 
          onClick={() => {
            setFamilyHistoryToEdit(null);
            setIsDialogOpen(true);
          }} 
          size="sm"
          className="rounded-full h-10 w-10 p-0 bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Add/Edit Family History Dialog */}
      <FamilyHistoryDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        familyHistory={familyHistoryToEdit || undefined}
        title={familyHistoryToEdit ? "Editar histórico familiar" : "Adicionar histórico familiar"}
        onSave={handleSaveFamilyHistory}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteFamilyHistoryDialog
        isOpen={!!recordToDelete}
        onOpenChange={() => setRecordToDelete(null)}
        onDelete={handleDeleteRecord}
      />
    </div>
  );
};
