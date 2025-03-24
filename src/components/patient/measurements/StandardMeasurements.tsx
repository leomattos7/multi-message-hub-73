
import React, { useState } from "react";
import { WeightHeightMeasurements } from "./WeightHeightMeasurements";
import { AbdominalBMIMeasurements } from "./AbdominalBMIMeasurements";
import { MeasurementDialogs } from "./MeasurementDialogs";

interface StandardMeasurementsProps {
  weight: number | null;
  height: number | null;
  abdominalCircumference: number | null;
  bmi: number | null;
  setWeight: (value: number | null) => void;
  setHeight: (value: number | null) => void;
  setAbdominalCircumference: (value: number | null) => void;
}

export function StandardMeasurements({
  weight,
  height,
  abdominalCircumference,
  bmi,
  setWeight,
  setHeight,
  setAbdominalCircumference,
}: StandardMeasurementsProps) {
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);
  const [isHeightDialogOpen, setIsHeightDialogOpen] = useState(false);
  const [isAbdominalDialogOpen, setIsAbdominalDialogOpen] = useState(false);
  const [isBMIDialogOpen, setIsBMIDialogOpen] = useState(false);
  
  const [editWeight, setEditWeight] = useState(weight?.toString() || "");
  const [editHeight, setEditHeight] = useState(height?.toString() || "");
  const [editAbdominal, setEditAbdominal] = useState(abdominalCircumference?.toString() || "");
  
  const handleSaveWeight = () => {
    const value = parseFloat(editWeight);
    if (!isNaN(value)) {
      setWeight(value);
    }
    setIsWeightDialogOpen(false);
  };

  const handleSaveHeight = () => {
    const value = parseFloat(editHeight);
    if (!isNaN(value)) {
      setHeight(value);
    }
    setIsHeightDialogOpen(false);
  };

  const handleSaveAbdominal = () => {
    const value = parseFloat(editAbdominal);
    if (!isNaN(value)) {
      setAbdominalCircumference(value);
    }
    setIsAbdominalDialogOpen(false);
  };

  const openWeightDialog = () => {
    setEditWeight(weight?.toString() || "");
    setIsWeightDialogOpen(true);
  };

  const openHeightDialog = () => {
    setEditHeight(height?.toString() || "");
    setIsHeightDialogOpen(true);
  };

  const openAbdominalDialog = () => {
    setEditAbdominal(abdominalCircumference?.toString() || "");
    setIsAbdominalDialogOpen(true);
  };

  const openBMIDialog = () => {
    setIsBMIDialogOpen(true);
  };

  return (
    <>
      <WeightHeightMeasurements
        weight={weight}
        height={height}
        openWeightDialog={openWeightDialog}
        openHeightDialog={openHeightDialog}
      />
      
      <AbdominalBMIMeasurements
        abdominalCircumference={abdominalCircumference}
        bmi={bmi}
        openAbdominalDialog={openAbdominalDialog}
        openBMIDialog={openBMIDialog}
      />

      <MeasurementDialogs
        isWeightDialogOpen={isWeightDialogOpen}
        isHeightDialogOpen={isHeightDialogOpen}
        isAbdominalDialogOpen={isAbdominalDialogOpen}
        isBMIDialogOpen={isBMIDialogOpen}
        setIsWeightDialogOpen={setIsWeightDialogOpen}
        setIsHeightDialogOpen={setIsHeightDialogOpen}
        setIsAbdominalDialogOpen={setIsAbdominalDialogOpen}
        setIsBMIDialogOpen={setIsBMIDialogOpen}
        editWeight={editWeight}
        editHeight={editHeight}
        editAbdominal={editAbdominal}
        bmi={bmi}
        setEditWeight={setEditWeight}
        setEditHeight={setEditHeight}
        setEditAbdominal={setEditAbdominal}
        handleSaveWeight={handleSaveWeight}
        handleSaveHeight={handleSaveHeight}
        handleSaveAbdominal={handleSaveAbdominal}
      />
    </>
  );
}
