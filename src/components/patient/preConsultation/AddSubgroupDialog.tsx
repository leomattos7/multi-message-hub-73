
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { NewSubgroupData } from "./types";

interface AddSubgroupDialogProps {
  onAddSubgroup: (subgroupData: NewSubgroupData) => void;
}

export const AddSubgroupDialog: React.FC<AddSubgroupDialogProps> = ({ onAddSubgroup }) => {
  const [newSubgroupName, setNewSubgroupName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddSubgroup = () => {
    if (newSubgroupName.trim() !== "") {
      onAddSubgroup({
        name: newSubgroupName
      });
      setNewSubgroupName("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          Novo Grupo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Grupo</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={newSubgroupName}
            onChange={(e) => setNewSubgroupName(e.target.value)}
            placeholder="Nome do grupo"
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleAddSubgroup}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
