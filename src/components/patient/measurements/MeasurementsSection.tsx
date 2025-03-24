
import React from "react";
import { usePatientMeasurements } from "@/hooks/use-patient-measurements";
import { MeasurementsList } from "./MeasurementsList";
import { AddMeasurementForm } from "./AddMeasurementForm";

interface MeasurementsSectionProps {
  patientId?: string;
}

export function MeasurementsSection({ patientId }: MeasurementsSectionProps) {
  const {
    allMeasurements,
    isLoading,
    isAddingMeasurement,
    setIsAddingMeasurement,
    newMeasurement,
    setNewMeasurement,
    addCustomMeasurement,
    refetchMeasurements
  } = usePatientMeasurements(patientId);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Carregando medições...</p>;
  }

  return (
    <div className="space-y-6">
      <MeasurementsList 
        measurements={allMeasurements} 
        patientId={patientId}
        onMeasurementUpdated={refetchMeasurements}
      />
      
      <AddMeasurementForm
        isAddingMeasurement={isAddingMeasurement}
        setIsAddingMeasurement={setIsAddingMeasurement}
        newMeasurement={newMeasurement}
        setNewMeasurement={setNewMeasurement}
        addCustomMeasurement={addCustomMeasurement}
      />
    </div>
  );
}
