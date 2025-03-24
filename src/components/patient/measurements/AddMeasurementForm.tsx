
import React from "react";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MeasurementForm } from "@/types/measurement";

interface AddMeasurementFormProps {
  isAddingMeasurement: boolean;
  setIsAddingMeasurement: (value: boolean) => void;
  newMeasurement: MeasurementForm;
  setNewMeasurement: (measurement: MeasurementForm) => void;
  addCustomMeasurement: () => void;
}

export function AddMeasurementForm({
  isAddingMeasurement,
  setIsAddingMeasurement,
  newMeasurement,
  setNewMeasurement,
  addCustomMeasurement,
}: AddMeasurementFormProps) {
  if (isAddingMeasurement) {
    return (
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
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="mt-4"
      onClick={() => setIsAddingMeasurement(true)}
    >
      <Plus className="h-4 w-4 mr-1" />
      Adicionar Medição
    </Button>
  );
}
