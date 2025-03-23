
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
import { CodeAutocomplete } from "./CodeAutocomplete";

interface ProblemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newProblem: string;
  setNewProblem: (value: string) => void;
  problemCID: string;
  setProblemCID: (value: string) => void;
  problemCIAP: string;
  setProblemCIAP: (value: string) => void;
  onAdd: () => void;
}

export const ProblemDialog = ({
  isOpen,
  onOpenChange,
  newProblem = "", // Ensure these have default values
  setNewProblem,
  problemCID = "",
  setProblemCID,
  problemCIAP = "",
  setProblemCIAP,
  onAdd,
}: ProblemDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar novo problema</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input 
            placeholder="Nome do problema/diagnóstico" 
            value={newProblem || ""}
            onChange={(e) => setNewProblem(e.target.value)}
          />
          <div className="space-y-1">
            <CodeAutocomplete
              placeholder="CID (opcional)"
              value={problemCID || ""}
              onChange={setProblemCID}
            />
          </div>
          <div className="space-y-1">
            <CodeAutocomplete
              placeholder="CIAP (opcional)"
              value={problemCIAP || ""}
              onChange={setProblemCIAP}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onAdd}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
