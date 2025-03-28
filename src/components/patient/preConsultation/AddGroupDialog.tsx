
import React from "react";
import { PlusIcon } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddGroupDialogProps {
  newGroupName: string;
  onNewGroupNameChange: (name: string) => void;
  onAddGroup: () => boolean;
}

export const AddGroupDialog: React.FC<AddGroupDialogProps> = ({
  newGroupName,
  onNewGroupNameChange,
  onAddGroup
}) => {
  const [open, setOpen] = React.useState(false);

  const handleAddGroup = () => {
    const success = onAddGroup();
    if (success) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
        >
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
            value={newGroupName}
            onChange={(e) => onNewGroupNameChange(e.target.value)}
            placeholder="Nome do grupo"
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleAddGroup}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
