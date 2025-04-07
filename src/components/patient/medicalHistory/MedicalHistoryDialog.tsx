
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
import { MedicalHistoryItem } from "@/types/medicalHistory";

interface MedicalHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  medicalHistory?: MedicalHistoryItem;
  title?: string;
  onSave: (medicalHistoryData: Partial<MedicalHistoryItem>) => void;
}

export const MedicalHistoryDialog = ({
  isOpen,
  onOpenChange,
  medicalHistory,
  title = "Adicionar antecedente pessoal",
  onSave,
}: MedicalHistoryDialogProps) => {
  const [description, setDescription] = React.useState("");
  const [cid, setCid] = React.useState("");
  const [ciap, setCiap] = React.useState("");

  // Reset form or fill with data when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (medicalHistory) {
        setDescription(medicalHistory.description || "");
        setCid(medicalHistory.cid || "");
        setCiap(medicalHistory.ciap || "");
      } else {
        // Reset form for new history
        setDescription("");
        setCid("");
        setCiap("");
      }
    }
  }, [isOpen, medicalHistory]);

  const handleSave = () => {
    if (!description.trim()) return;

    const medicalHistoryData: Partial<MedicalHistoryItem> = {
      description: description.trim(),
      cid: cid.trim() || undefined,
      ciap: ciap.trim() || undefined,
    };

    // If editing, pass the id
    if (medicalHistory?.id) {
      medicalHistoryData.id = medicalHistory.id;
    }

    onSave(medicalHistoryData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do antecedente pessoal do paciente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input 
            placeholder="Descrição do antecedente pessoal" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            disabled={!description.trim()}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
