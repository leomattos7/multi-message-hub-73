
import React from "react";
import { Input } from "@/components/ui/input";
import { MEASUREMENT_UNITS } from "./constants";

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

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            Peso (kg)
          </label>
          <Input
            id="weight"
            type="number"
            value={weight ?? ""}
            onChange={(e) => handleInputChange(e, setWeight)}
            placeholder="0"
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700">
            Altura (cm)
          </label>
          <Input
            id="height"
            type="number"
            value={height ?? ""}
            onChange={(e) => handleInputChange(e, setHeight)}
            placeholder="0"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="abdominal" className="block text-sm font-medium text-gray-700">
            Circunferência Abdominal (cm)
          </label>
          <Input
            id="abdominal"
            type="number"
            value={abdominalCircumference ?? ""}
            onChange={(e) => handleInputChange(e, setAbdominalCircumference)}
            placeholder="0"
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            IMC (kg/m²)
          </label>
          <Input
            value={bmi ?? "-"}
            readOnly
            className="mt-1 bg-gray-50"
          />
        </div>
      </div>
    </>
  );
}
