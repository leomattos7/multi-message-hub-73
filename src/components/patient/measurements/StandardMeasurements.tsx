
import React from "react";
import { Input } from "@/components/ui/input";
import { MEASUREMENT_UNITS, getBMIClassification } from "./constants";

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
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (value: number | null) => void
  ) => {
    const value = event.target.value;
    if (value === "") {
      setter(null);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setter(numValue);
      }
    }
  };

  // Get BMI classification for styling
  const bmiClassification = getBMIClassification(bmi);
  const bmiColorClass = bmiClassification?.color || "";

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg)
          </label>
          <Input
            id="weight"
            type="number"
            value={weight ?? ""}
            onChange={(e) => handleInputChange(e, setWeight)}
            placeholder="0"
            className="text-lg font-medium py-6 px-4 bg-gray-50"
          />
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
            Altura (cm)
          </label>
          <Input
            id="height"
            type="number"
            value={height ?? ""}
            onChange={(e) => handleInputChange(e, setHeight)}
            placeholder="0"
            className="text-lg font-medium py-6 px-4 bg-gray-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="abdominal" className="block text-sm font-medium text-gray-700 mb-1">
            Circunferência Abdominal (cm)
          </label>
          <Input
            id="abdominal"
            type="number"
            value={abdominalCircumference ?? ""}
            onChange={(e) => handleInputChange(e, setAbdominalCircumference)}
            placeholder="0"
            className="text-lg font-medium py-6 px-4 bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IMC (kg/m²)
          </label>
          <Input
            value={bmi ? bmi.toString() : "-"}
            readOnly
            className={`text-lg font-medium py-6 px-4 bg-gray-50 ${bmiColorClass}`}
          />
        </div>
      </div>
    </>
  );
}
