
import React from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Prescription } from "./types";

interface PrescriptionFormProps {
  prescriptions: Prescription[];
  onChange: (prescriptions: Prescription[]) => void;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  prescriptions,
  onChange,
}) => {
  const addPrescription = () => {
    const newPrescription: Prescription = {
      id: Date.now().toString(),
      medication: "",
      dosage: "",
      route: "",
      continuous: false,
    };
    onChange([...prescriptions, newPrescription]);
  };

  const removePrescription = (id: string) => {
    onChange(prescriptions.filter((p) => p.id !== id));
  };

  const updatePrescription = (id: string, field: keyof Omit<Prescription, "id">, value: string | boolean) => {
    onChange(
      prescriptions.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  return (
    <div className="space-y-4">
      {prescriptions.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Nenhuma medicação adicionada
        </div>
      ) : (
        <div className="space-y-6">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="p-4 border rounded-md bg-gray-50 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={() => removePrescription(prescription.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
              
              <div className="space-y-3 pr-8">
                <div>
                  <label htmlFor={`medication-${prescription.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                    Nome da medicação
                  </label>
                  <Input
                    id={`medication-${prescription.id}`}
                    value={prescription.medication}
                    onChange={(e) => updatePrescription(prescription.id, "medication", e.target.value)}
                    placeholder="Nome da medicação"
                  />
                </div>
                
                <div>
                  <label htmlFor={`dosage-${prescription.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                    Dose/Concentração
                  </label>
                  <Input
                    id={`dosage-${prescription.id}`}
                    value={prescription.dosage}
                    onChange={(e) => updatePrescription(prescription.id, "dosage", e.target.value)}
                    placeholder="Ex: 500mg, 10mg/ml"
                  />
                </div>
                
                <div>
                  <label htmlFor={`route-${prescription.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                    Via de administração
                  </label>
                  <Input
                    id={`route-${prescription.id}`}
                    value={prescription.route}
                    onChange={(e) => updatePrescription(prescription.id, "route", e.target.value)}
                    placeholder="Ex: Oral, Intravenosa, Subcutânea"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`continuous-${prescription.id}`}
                    checked={prescription.continuous}
                    onCheckedChange={(checked) => 
                      updatePrescription(prescription.id, "continuous", checked === true)
                    }
                  />
                  <label
                    htmlFor={`continuous-${prescription.id}`}
                    className="text-xs font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Uso contínuo
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center"
        onClick={addPrescription}
      >
        <Plus className="mr-1 h-4 w-4" />
        Adicionar medicação
      </Button>
    </div>
  );
};
