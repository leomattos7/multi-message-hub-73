
import React from "react";
import { Plus, Save } from "lucide-react";
import { usePatientMeasurements } from "@/hooks/use-patient-measurements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";

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

  if (isLoading) {
    return <p className="text-sm text-gray-500">Carregando medições...</p>;
  }

  return (
    <div className="space-y-4">
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

      {allMeasurements.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-sm mb-2">Todas as Medições</h4>
          <div className="space-y-2">
            {allMeasurements.map((measurement, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{measurement.name}</span>
                    <span>
                      {measurement.value} {measurement.unit}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isAddingMeasurement ? (
        <div className="mt-4 p-4 border rounded-md">
          <h4 className="font-medium text-sm mb-3">Nova Medição</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700">
                Nome da Medição
              </label>
              <Input
                value={newMeasurement.name}
                onChange={(e) => setNewMeasurement({ ...newMeasurement, name: e.target.value })}
                placeholder="Ex: Pressão arterial"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700">
                  Valor
                </label>
                <Input
                  type="number"
                  value={newMeasurement.value}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, value: e.target.value })}
                  placeholder="Ex: 120"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">
                  Unidade
                </label>
                <Input
                  value={newMeasurement.unit}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, unit: e.target.value })}
                  placeholder="Ex: mmHg"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex space-x-2 justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAddingMeasurement(false)}
              >
                Cancelar
              </Button>
              <Button 
                size="sm"
                onClick={addCustomMeasurement}
              >
                <Save className="mr-1 h-4 w-4" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={() => setIsAddingMeasurement(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Medição
        </Button>
      )}
    </div>
  );
}
