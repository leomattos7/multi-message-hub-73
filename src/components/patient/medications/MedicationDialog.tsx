
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MedicationItem } from "@/types/medication";

interface MedicationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (medicationData: Partial<MedicationItem>) => void;
  medication?: MedicationItem;
  title?: string;
}

export const MedicationDialog: React.FC<MedicationDialogProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  medication,
  title = "Nova Medicação"
}) => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");

  // Reset form when dialog opens or medication changes
  useEffect(() => {
    if (isOpen) {
      if (medication) {
        setName(medication.name || "");
        setDosage(medication.dosage || "");
        setInstructions(medication.instructions || "");
      } else {
        // Reset form for new medication
        setName("");
        setDosage("");
        setInstructions("");
      }
    }
  }, [isOpen, medication]);

  const handleSave = () => {
    if (!name.trim()) return;

    const medicationData: Partial<MedicationItem> = {
      name: name.trim(),
      dosage: dosage.trim() || undefined,
      instructions: instructions.trim() || undefined,
    };

    // If editing, pass the id
    if (medication?.id) {
      medicationData.id = medication.id;
    }

    onSave(medicationData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="medication-name" className="text-sm font-medium">
              Nome da medicação
            </label>
            <Input
              id="medication-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome da medicação"
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="medication-dosage" className="text-sm font-medium">
              Dosagem
            </label>
            <Input
              id="medication-dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="Ex: 500mg, 10mg/ml"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="medication-instructions" className="text-sm font-medium">
              Instruções
            </label>
            <Textarea
              id="medication-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instruções de uso"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
