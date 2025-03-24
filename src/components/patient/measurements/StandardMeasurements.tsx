
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { MEASUREMENT_NAMES, MEASUREMENT_UNITS, getBMIClassification } from "./constants";
import { MeasurementDialog } from "./MeasurementDialog";

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
  
  // Get BMI classification for styling
  const bmiClassification = getBMIClassification(bmi);
  const bmiColorClass = bmiClassification?.color || "";

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
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg)
          </label>
          <div className="relative">
            <Input
              id="weight"
              type="text"
              value={weight ?? "-"}
              readOnly
              className="text-lg font-medium py-6 px-4 bg-gray-50 pr-10"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={openWeightDialog}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
            Altura (cm)
          </label>
          <div className="relative">
            <Input
              id="height"
              type="text"
              value={height ?? "-"}
              readOnly
              className="text-lg font-medium py-6 px-4 bg-gray-50 pr-10"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={openHeightDialog}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="abdominal" className="block text-sm font-medium text-gray-700 mb-1">
            Circunferência Abdominal (cm)
          </label>
          <div className="relative">
            <Input
              id="abdominal"
              type="text"
              value={abdominalCircumference ?? "-"}
              readOnly
              className="text-lg font-medium py-6 px-4 bg-gray-50 pr-10"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={openAbdominalDialog}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IMC (kg/m²)
          </label>
          <div className="relative">
            <Input
              value={bmi ? bmi.toString() : "-"}
              readOnly
              className={`text-lg font-medium py-6 px-4 bg-gray-50 ${bmiColorClass} pr-10`}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={openBMIDialog}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

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
