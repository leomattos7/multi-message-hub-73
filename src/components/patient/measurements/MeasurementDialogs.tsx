
import React from "react";
import { MeasurementDialog } from "./MeasurementDialog";
import { MEASUREMENT_UNITS } from "./constants";

interface MeasurementDialogsProps {
  isWeightDialogOpen: boolean;
  isHeightDialogOpen: boolean;
  isAbdominalDialogOpen: boolean;
  isBMIDialogOpen: boolean;
  setIsWeightDialogOpen: (open: boolean) => void;
  setIsHeightDialogOpen: (open: boolean) => void;
  setIsAbdominalDialogOpen: (open: boolean) => void;
  setIsBMIDialogOpen: (open: boolean) => void;
  editWeight: string;
  editHeight: string;
  editAbdominal: string;
  bmi: number | null;
  setEditWeight: (value: string) => void;
  setEditHeight: (value: string) => void;
  setEditAbdominal: (value: string) => void;
  handleSaveWeight: () => void;
  handleSaveHeight: () => void;
  handleSaveAbdominal: () => void;
}

export function MeasurementDialogs({
  isWeightDialogOpen,
  isHeightDialogOpen,
  isAbdominalDialogOpen,
  isBMIDialogOpen,
  setIsWeightDialogOpen,
  setIsHeightDialogOpen,
  setIsAbdominalDialogOpen,
  setIsBMIDialogOpen,
  editWeight,
  editHeight,
  editAbdominal,
  bmi,
  setEditWeight,
  setEditHeight,
  setEditAbdominal,
  handleSaveWeight,
  handleSaveHeight,
  handleSaveAbdominal
}: MeasurementDialogsProps) {
  return (
    <>
      {/* Weight Dialog */}
      <MeasurementDialog
        isOpen={isWeightDialogOpen}
        onOpenChange={setIsWeightDialogOpen}
        measurementName="Peso"
        measurementValue={editWeight}
        measurementUnit={MEASUREMENT_UNITS.WEIGHT}
        setMeasurementValue={setEditWeight}
        onSave={handleSaveWeight}
      />

      {/* Height Dialog */}
      <MeasurementDialog
        isOpen={isHeightDialogOpen}
        onOpenChange={setIsHeightDialogOpen}
        measurementName="Altura"
        measurementValue={editHeight}
        measurementUnit={MEASUREMENT_UNITS.HEIGHT}
        setMeasurementValue={setEditHeight}
        onSave={handleSaveHeight}
      />

      {/* Abdominal Circumference Dialog */}
      <MeasurementDialog
        isOpen={isAbdominalDialogOpen}
        onOpenChange={setIsAbdominalDialogOpen}
        measurementName="Circunferência Abdominal"
        measurementValue={editAbdominal}
        measurementUnit={MEASUREMENT_UNITS.ABDOMINAL}
        setMeasurementValue={setEditAbdominal}
        onSave={handleSaveAbdominal}
      />

      {/* BMI Dialog (read-only) */}
      <MeasurementDialog
        isOpen={isBMIDialogOpen}
        onOpenChange={setIsBMIDialogOpen}
        measurementName="IMC"
        measurementValue={bmi?.toString() || "-"}
        measurementUnit="kg/m²"
        setMeasurementValue={() => {}}
        onSave={() => {}}
        isReadOnly={true}
      />
    </>
  );
}
