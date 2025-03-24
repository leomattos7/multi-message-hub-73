
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface MedicationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newMedication: string;
  setNewMedication: (value: string) => void;
  medDosage: string;
  setMedDosage: (value: string) => void;
  medInstructions: string;
  setMedInstructions: (value: string) => void;
  onAdd: () => void;
}

export const MedicationDialog = ({
  isOpen,
  onOpenChange,
  newMedication,
  setNewMedication,
  medDosage,
  setMedDosage,
  medInstructions,
  setMedInstructions,
  onAdd,
}: MedicationDialogProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newMedication.trim()) {
      e.preventDefault();
      onAdd();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar nova medicação</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input 
            placeholder="Nome da medicação" 
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input 
                placeholder="Dosagem (opcional)" 
                value={medDosage}
                onChange={(e) => setMedDosage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div>
              <Input 
                placeholder="Posologia (opcional)" 
                value={medInstructions}
                onChange={(e) => setMedInstructions(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onAdd} disabled={!newMedication.trim()}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
