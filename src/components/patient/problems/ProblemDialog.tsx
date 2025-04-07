
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ProblemItem } from "@/types/problem";

interface ProblemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  problem?: ProblemItem;
  title?: string;
  onSave: (problemData: Partial<ProblemItem>) => void;
}

export const ProblemDialog = ({
  isOpen,
  onOpenChange,
  problem,
  title = "Adicionar novo problema",
  onSave,
}: ProblemDialogProps) => {
  const [name, setName] = React.useState("");
  const [cid, setCid] = React.useState("");
  const [ciap, setCiap] = React.useState("");

  // Reset form or fill with problem data when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (problem) {
        setName(problem.name || "");
        setCid(problem.cid || "");
        setCiap(problem.ciap || "");
      } else {
        // Reset form for new problem
        setName("");
        setCid("");
        setCiap("");
      }
    }
  }, [isOpen, problem]);

  const handleSave = () => {
    if (!name.trim()) return;

    const problemData: Partial<ProblemItem> = {
      name: name.trim(),
      cid: cid.trim() || undefined,
      ciap: ciap.trim() || undefined,
    };

    // If editing, pass the id
    if (problem?.id) {
      problemData.id = problem.id;
    }

    onSave(problemData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input 
            placeholder="Nome do problema/diagnóstico" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                placeholder="CID (opcional)"
                value={cid}
                onChange={(e) => setCid(e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="CIAP (opcional)"
                value={ciap}
                onChange={(e) => setCiap(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!name.trim()}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
