
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
  const [newRecord, setNewRecord] = useState("");
  const [relationship, setRelationship] = useState("");
  const [cid, setCid] = useState("");
  const [ciap, setCiap] = useState("");
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  
  const { 
    records: familyHistory, 
    recordsLoading, 
    createRecord, 
    deleteRecord 
  } = usePatientRecordsData(patientId, "historico_familiar");

  const handleAddRecord = async () => {
    if (!newRecord.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Descrição da condição ou doença é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    const recordData = {
      description: newRecord,
      ...(relationship ? { relationship } : {}),
      ...(cid ? { cid } : {}),
      ...(ciap ? { ciap } : {})
    };

    try {
      await createRecord(JSON.stringify(recordData), "historico_familiar");
      setNewRecord("");
      setRelationship("");
      setCid("");
      setCiap("");
      setIsDialogOpen(false);
      
      toast({
        title: "Histórico adicionado",
        description: "O histórico familiar foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao adicionar histórico familiar:", error);
      toast({
        title: "Erro ao adicionar histórico",
        description: "Houve um erro ao adicionar o histórico familiar. Tente novamente.",
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
          onClick={() => setIsDialogOpen(true)} 
          size="sm"
          className="rounded-full h-10 w-10 p-0 bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Add Record Dialog */}
      <FamilyHistoryDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        newRecord={newRecord}
        setNewRecord={setNewRecord}
        relationship={relationship}
        setRelationship={setRelationship}
        cid={cid}
        setCid={setCid}
        ciap={ciap}
        setCiap={setCiap}
        onAdd={handleAddRecord}
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
