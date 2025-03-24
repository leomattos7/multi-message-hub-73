
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

interface FamilyHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newRecord: string;
  setNewRecord: (value: string) => void;
  relationship: string;
  setRelationship: (value: string) => void;
  cid: string;
  setCid: (value: string) => void;
  ciap: string;
  setCiap: (value: string) => void;
  onAdd: () => void;
}

export const FamilyHistoryDialog = ({
  isOpen,
  onOpenChange,
  newRecord = "",
  setNewRecord,
  relationship = "",
  setRelationship,
  cid = "",
  setCid,
  ciap = "",
  setCiap,
  onAdd,
}: FamilyHistoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar histórico familiar</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input 
            placeholder="Descrição da condição ou doença" 
            value={newRecord || ""}
            onChange={(e) => setNewRecord(e.target.value)}
          />
          <Input 
            placeholder="Parentesco (ex: mãe, pai, irmão)" 
            value={relationship || ""}
            onChange={(e) => setRelationship(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                placeholder="CID (opcional)"
                value={cid || ""}
                onChange={(e) => setCid(e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="CIAP (opcional)"
                value={ciap || ""}
                onChange={(e) => setCiap(e.target.value)}
              />
            </div>
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
