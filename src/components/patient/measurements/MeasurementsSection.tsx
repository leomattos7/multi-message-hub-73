
import React from "react";
import { usePatientMeasurements } from "@/hooks/use-patient-measurements";
import { StandardMeasurements } from "./StandardMeasurements";
import { MeasurementsList } from "./MeasurementsList";
import { AddMeasurementForm } from "./AddMeasurementForm";

interface MeasurementsSectionProps {
  patientId?: string;
}

export function MeasurementsSection({ patientId }: MeasurementsSectionProps) {
  const {
    weight,
    height,
    abdominalCircumference,
    bmi,
    allMeasurements,
    isLoading,
    setWeight,
    setHeight,
    setAbdominalCircumference,
    isAddingMeasurement,
    setIsAddingMeasurement,
    newMeasurement,
    setNewMeasurement,
    addCustomMeasurement
  } = usePatientMeasurements(patientId);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Carregando medições...</p>;
  }

  return (
    <div className="space-y-4">
      <StandardMeasurements
        weight={weight}
        height={height}
        abdominalCircumference={abdominalCircumference}
        bmi={bmi}
        setWeight={setWeight}
        setHeight={setHeight}
        setAbdominalCircumference={setAbdominalCircumference}
      />
      
      <MeasurementsList measurements={allMeasurements} />
      
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
