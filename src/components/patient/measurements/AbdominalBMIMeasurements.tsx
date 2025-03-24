
import React from "react";
import { MeasurementField } from "./MeasurementField";
import { getBMIClassification } from "./constants";

interface AbdominalBMIMeasurementsProps {
  abdominalCircumference: number | null;
  bmi: number | null;
  openAbdominalDialog: () => void;
  openBMIDialog: () => void;
}

export function AbdominalBMIMeasurements({
  abdominalCircumference,
  bmi,
  openAbdominalDialog,
  openBMIDialog
}: AbdominalBMIMeasurementsProps) {
  // Get BMI classification for styling
  const bmiClassification = getBMIClassification(bmi);
  const bmiColorClass = bmiClassification?.color || "";

  return (
    <div className="grid grid-cols-2 gap-4">
      <MeasurementField
        id="abdominal"
        label="Circunferência Abdominal (cm)"
        value={abdominalCircumference}
        onClick={openAbdominalDialog}
      />
      <MeasurementField
        id="bmi"
        label="IMC (kg/m²)"
        value={bmi}
        onClick={openBMIDialog}
        colorClass={bmiColorClass}
      />
    </div>
  );
}
