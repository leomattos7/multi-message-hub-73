
import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface AddMedicationFormProps {
  onAddMedication: (name: string) => Promise<void>;
  onCancel: () => void;
}

export const AddMedicationForm = ({ onAddMedication, onCancel }: AddMedicationFormProps) => {
  const [newMedication, setNewMedication] = useState("");

  const handleSubmit = async () => {
    if (!newMedication.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Nome da medicação é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onAddMedication(newMedication);
      setNewMedication("");
    } catch (error) {
      console.error("Erro ao adicionar medicação:", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Nova medicação</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 rounded-full"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <Input 
          placeholder="Nome da medicação" 
          value={newMedication}
          onChange={(e) => setNewMedication(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-sm"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            size="sm"
            onClick={handleSubmit}
            disabled={!newMedication.trim()}
          >
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};
