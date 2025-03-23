
import React, { useState } from "react";
import { SectionType } from "@/hooks/use-collapsible-sections";
import { usePatientRecordsData } from "@/hooks/use-patient-records-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MedicationItem {
  id: string;
  name: string;
  dosage?: string;
  instructions?: string;
  created_at: string;
}

const MedicationsSection = ({ patientId }: { patientId?: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMedication, setNewMedication] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [medInstructions, setMedInstructions] = useState("");
  const [medicationToDelete, setMedicationToDelete] = useState<string | null>(null);
  const { records: medications, recordsLoading, createRecord, refetchRecords, deleteRecord } = usePatientRecordsData(patientId, "medicacao");

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
      setNewMedication("");
      setMedDosage("");
      setMedInstructions("");
      setIsDialogOpen(false);
      
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

  const handleDeleteMedication = async (id: string) => {
    try {
      await deleteRecord(id);
      
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
      {/* Add Medication Button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          size="sm"
          className="rounded-full h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Add Medication Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar nova medicação</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input 
              placeholder="Nome da medicação" 
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
            />
            <Input 
              placeholder="Dosagem (opcional)" 
              value={medDosage}
              onChange={(e) => setMedDosage(e.target.value)}
            />
            <Input 
              placeholder="Posologia (opcional)" 
              value={medInstructions}
              onChange={(e) => setMedInstructions(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddMedication}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!medicationToDelete} onOpenChange={() => setMedicationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta medicação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => medicationToDelete && handleDeleteMedication(medicationToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Medications List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Medicações registradas</h3>
        {recordsLoading ? (
          <p className="text-sm text-gray-500">Carregando medicações...</p>
        ) : medications && medications.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {medications.map((med) => {
              let medicationData: MedicationItem;
              try {
                medicationData = JSON.parse(med.content);
              } catch (e) {
                // Fallback for old format
                medicationData = {
                  id: med.id,
                  name: med.content,
                  created_at: med.created_at
                };
              }
              
              return (
                <Card key={med.id} className="border border-gray-200">
                  <CardContent className="p-3 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                      onClick={() => setMedicationToDelete(med.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="font-medium pr-6">{medicationData.name}</div>
                    {medicationData.dosage && (
                      <div className="text-sm text-gray-600">Dosagem: {medicationData.dosage}</div>
                    )}
                    {medicationData.instructions && (
                      <div className="text-sm text-gray-600">Posologia: {medicationData.instructions}</div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Nenhuma medicação registrada</p>
        )}
      </div>
    </div>
  );
};

export const renderPatientSectionContent = (sectionId: SectionType, patientId?: string) => {
  switch (sectionId) {
    case "medicacoes":
      return <MedicationsSection patientId={patientId} />;
    case "problemas":
      return <p>Lista de problemas e diagnósticos do paciente</p>;
    case "exames":
      return <p>Resultados dos últimos exames realizados</p>;
    case "medicoes":
      return <p>Medições do paciente</p>;
    case "antecedente_pessoal":
      return <p>Histórico médico pessoal do paciente</p>;
    case "historico_familiar":
      return <p>Doenças e condições presentes na família do paciente</p>;
    default:
      return <p>Informações não disponíveis</p>;
  }
};
