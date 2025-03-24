
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalculatedMeasurement } from "@/types/measurement";
import { MEASUREMENT_DISPLAY_NAMES, getBMIClassification } from "./constants";

interface MeasurementsListProps {
  measurements: CalculatedMeasurement[];
}

export function MeasurementsList({ measurements }: MeasurementsListProps) {
  if (measurements.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h4 className="font-medium text-sm mb-2">Todas as Medições</h4>
      <div className="space-y-2">
        {measurements.map((measurement, index) => {
          // Add color for BMI measurement
          let colorClass = "";
          if (measurement.name === "IMC" && typeof measurement.value === "number") {
            const classification = getBMIClassification(measurement.value);
            colorClass = classification?.color || "";
          }
          
          return (
            <Card key={index} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{measurement.name}</span>
                  <span className={colorClass}>
                    {measurement.value} {measurement.unit}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
