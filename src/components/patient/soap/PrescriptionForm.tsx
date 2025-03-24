
import React, { useState } from "react";
import { Trash2, Plus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Prescription } from "./types";
import { toast } from "@/components/ui/use-toast";

interface PrescriptionFormProps {
  prescriptions: Prescription[];
  onChange: (prescriptions: Prescription[]) => void;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  prescriptions,
  onChange,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState<Omit<Prescription, "id">>({
    medication: "",
    dosage: "",
    route: "",
    continuous: false,
  });

  const addPrescription = () => {
    // Validate that at least medication is filled
    if (!currentPrescription.medication.trim()) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, informe pelo menos o nome da medicação",
        variant: "destructive",
      });
      return;
    }

    const newPrescription: Prescription = {
      id: Date.now().toString(),
      ...currentPrescription,
    };
    onChange([...prescriptions, newPrescription]);
    
    // Reset form after adding
    setCurrentPrescription({
      medication: "",
      dosage: "",
      route: "",
      continuous: false,
    });
    // Hide the form after adding medication
    setShowForm(false);

    toast({
      title: "Medicação adicionada",
      description: "A medicação foi adicionada à receita",
    });
  };

  const removePrescription = (id: string) => {
    onChange(prescriptions.filter((p) => p.id !== id));
  };

  const handleInputChange = (field: keyof Omit<Prescription, "id">, value: string | boolean) => {
    setCurrentPrescription(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      {showForm && (
        <div className="p-4 border rounded-md bg-gray-50">
          <div className="space-y-3">
            <div>
              <label htmlFor="medication" className="block text-xs font-medium text-gray-700 mb-1">
                Nome da medicação
              </label>
              <Input
                id="medication"
                value={currentPrescription.medication}
                onChange={(e) => handleInputChange("medication", e.target.value)}
                placeholder="Nome da medicação"
              />
            </div>
            
            <div>
              <label htmlFor="dosage" className="block text-xs font-medium text-gray-700 mb-1">
                Dose/Concentração
              </label>
              <Input
                id="dosage"
                value={currentPrescription.dosage}
                onChange={(e) => handleInputChange("dosage", e.target.value)}
                placeholder="Ex: 500mg, 10mg/ml"
              />
            </div>
            
            <div>
              <label htmlFor="route" className="block text-xs font-medium text-gray-700 mb-1">
                Via de administração
              </label>
              <Input
                id="route"
                value={currentPrescription.route}
                onChange={(e) => handleInputChange("route", e.target.value)}
                placeholder="Ex: Oral, Intravenosa, Subcutânea"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="continuous"
                  checked={currentPrescription.continuous}
                  onCheckedChange={(checked) => 
                    handleInputChange("continuous", checked === true)
                  }
                />
                <label
                  htmlFor="continuous"
                  className="text-xs font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Uso contínuo
                </label>
              </div>
              
              <Button 
                type="button" 
                size="sm"
                className="ml-2 bg-green-500 hover:bg-green-600" 
                onClick={addPrescription}
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}

      {prescriptions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Medicações adicionadas:</h3>
          <div className="space-y-3">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="p-3 border rounded-md bg-white relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => removePrescription(prescription.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                
                <div className="space-y-1 pr-8">
                  <p className="font-medium">{prescription.medication}</p>
                  {prescription.dosage && (
                    <p className="text-sm text-gray-600">Dose: {prescription.dosage}</p>
                  )}
                  {prescription.route && (
                    <p className="text-sm text-gray-600">Via: {prescription.route}</p>
                  )}
                  {prescription.continuous && (
                    <p className="text-sm text-emerald-600">Uso contínuo</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center"
        onClick={() => {
          // Toggle the form visibility
          setShowForm(true);
          // Reset current prescription form if it was hidden
          if (!showForm) {
            setCurrentPrescription({
              medication: "",
              dosage: "",
              route: "",
              continuous: false,
            });
          }
        }}
      >
        <Plus className="mr-1 h-4 w-4" />
        Nova medicação
      </Button>
    </div>
  );
};
