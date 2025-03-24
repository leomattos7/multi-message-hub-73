
import React from "react";
import { MedicationItem } from "@/types/medication";
import { MedicationCard } from "./MedicationCard";

interface MedicationsListProps {
  medications: any[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  parseMedicationData: (med: any) => MedicationItem;
}

export const MedicationsList = ({ 
  medications, 
  isLoading, 
  onDelete,
  parseMedicationData
}: MedicationsListProps) => {
  if (isLoading) {
    return <p className="text-sm text-gray-500">Carregando medicações...</p>;
  }

  if (!medications || medications.length === 0) {
    return <p className="text-sm text-gray-500 italic">Nenhuma medicação registrada</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {medications.map((med) => {
        const medicationData = parseMedicationData(med);
        return (
          <MedicationCard 
            key={med.id} 
            medication={medicationData}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};
