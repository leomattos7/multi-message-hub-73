
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { CalculatedMeasurement } from "@/types/measurement";
import { MEASUREMENT_DISPLAY_NAMES, getBMIClassification } from "./constants";
import { MeasurementDialog } from "./MeasurementDialog";
import { saveMeasurement } from "@/services/measurements-service";
import { toast } from "@/components/ui/use-toast";

interface MeasurementsListProps {
  measurements: CalculatedMeasurement[];
  patientId?: string;
  onMeasurementUpdated: () => void;
}

export function MeasurementsList({ measurements, patientId, onMeasurementUpdated }: MeasurementsListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<CalculatedMeasurement | null>(null);
  const [editValue, setEditValue] = useState("");
  
  if (measurements.length === 0) {
    return null;
  }

  const handleEditClick = (measurement: CalculatedMeasurement) => {
    setSelectedMeasurement(measurement);
    setEditValue(measurement.value.toString());
    setIsDialogOpen(true);
  };

  const handleSaveMeasurement = async () => {
    if (!selectedMeasurement || !patientId) {
      toast({
        title: "Erro",
        description: "Dados inválidos para salvar",
        variant: "destructive",
      });
      return;
    }
    
    const numValue = parseFloat(editValue);
    if (isNaN(numValue)) {
      toast({
        title: "Erro",
        description: "O valor deve ser um número válido",
        variant: "destructive",
      });
      return;
    }
    
    const success = await saveMeasurement(
      patientId,
      selectedMeasurement.name,
      numValue,
      selectedMeasurement.unit
    );
    
    if (success) {
      setIsDialogOpen(false);
      onMeasurementUpdated();
    }
  };

  return (
    <div>
      <h4 className="font-medium text-sm mb-2">Todas as Medições</h4>
      <div className="space-y-2">
        {measurements.map((measurement, index) => {
          // Add color for BMI measurement
          let colorClass = "";
          let isReadOnly = false;
          
          if (measurement.name === "IMC" && typeof measurement.value === "number") {
            const classification = getBMIClassification(measurement.value);
            colorClass = classification?.color || "";
            isReadOnly = true; // BMI is calculated and should be read-only
          }
          
          return (
            <Card key={index} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{measurement.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className={colorClass}>
                      {measurement.value} {measurement.unit}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => handleEditClick(measurement)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedMeasurement && (
        <MeasurementDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          measurementName={selectedMeasurement.name}
          measurementValue={editValue}
          measurementUnit={selectedMeasurement.unit}
          setMeasurementValue={setEditValue}
          onSave={handleSaveMeasurement}
          isReadOnly={selectedMeasurement.name === "IMC"} // IMC is calculated and should be read-only
        />
      )}
    </div>
  );
}
