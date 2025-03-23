
import React, { useState } from "react";
import { SectionType } from "@/hooks/use-collapsible-sections";
import { usePatientRecordsData } from "@/hooks/use-patient-records-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";

interface MedicationItem {
  id: string;
  name: string;
  dosage?: string;
  instructions?: string;
  created_at: string;
}

const MedicationsSection = ({ patientId }: { patientId?: string }) => {
  const [newMedication, setNewMedication] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [medInstructions, setMedInstructions] = useState("");
  const { records: medications, recordsLoading, createRecord, refetchRecords } = usePatientRecordsData(patientId, "medicacao");

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

  return (
    <div className="space-y-4">
      <div className="space-y-4 bg-white p-3 rounded-md border border-gray-200">
        <h3 className="text-sm font-medium">Adicionar nova medicação</h3>
        <div className="space-y-2">
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
          <Button 
            onClick={handleAddMedication} 
            className="w-full"
            size="sm"
          >
            Adicionar
          </Button>
        </div>
      </div>

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
                  <CardContent className="p-3">
                    <div className="font-medium">{medicationData.name}</div>
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
