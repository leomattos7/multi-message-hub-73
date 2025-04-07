
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { FamilyHistoryItem } from "@/types/familyHistory";

interface FamilyHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  familyHistory?: FamilyHistoryItem;
  title?: string;
  onSave: (familyHistoryData: Partial<FamilyHistoryItem>) => void;
}

export const FamilyHistoryDialog = ({
  isOpen,
  onOpenChange,
  familyHistory,
  title = "Adicionar histórico familiar",
  onSave,
}: FamilyHistoryDialogProps) => {
  const [description, setDescription] = React.useState("");
  const [relationship, setRelationship] = React.useState("");
  const [cid, setCid] = React.useState("");
  const [ciap, setCiap] = React.useState("");

  // Reset form or fill with data when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (familyHistory) {
        setDescription(familyHistory.description || "");
        setRelationship(familyHistory.relationship || "");
        setCid(familyHistory.cid || "");
        setCiap(familyHistory.ciap || "");
      } else {
        // Reset form for new history
        setDescription("");
        setRelationship("");
        setCid("");
        setCiap("");
      }
    }
  }, [isOpen, familyHistory]);

  const handleSave = () => {
    if (!description.trim()) return;

    const familyHistoryData: Partial<FamilyHistoryItem> = {
      description: description.trim(),
      relationship: relationship.trim() || undefined,
      cid: cid.trim() || undefined,
      ciap: ciap.trim() || undefined,
    };

    // If editing, pass the id
    if (familyHistory?.id) {
      familyHistoryData.id = familyHistory.id;
    }

    onSave(familyHistoryData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do histórico familiar do paciente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input 
            placeholder="Descrição da condição ou doença" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoFocus
          />
          <Input 
            placeholder="Parentesco (ex: mãe, pai, irmão)" 
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
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
            disabled={!description.trim()}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
