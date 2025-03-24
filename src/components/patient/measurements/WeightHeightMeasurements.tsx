
import React from "react";
import { MeasurementField } from "./MeasurementField";

interface WeightHeightMeasurementsProps {
  weight: number | null;
  height: number | null;
  openWeightDialog: () => void;
  openHeightDialog: () => void;
}

export function WeightHeightMeasurements({
  weight,
  height,
  openWeightDialog,
  openHeightDialog
}: WeightHeightMeasurementsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <MeasurementField
        id="weight"
        label="Peso (kg)"
        value={weight}
        onClick={openWeightDialog}
      />
      <MeasurementField
        id="height"
        label="Altura (cm)"
        value={height}
        onClick={openHeightDialog}
      />
    </div>
  );
}
