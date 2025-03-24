
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Save, X, Trash } from "lucide-react";

interface RecordActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export const RecordActions: React.FC<RecordActionsProps> = ({
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}) => {
  return (
    <div className="flex items-center space-x-2">
      {isEditing ? (
        <>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4 mr-1" /> Cancelar
          </Button>
          <Button size="sm" onClick={onSave}>
            <Save className="h-4 w-4 mr-1" /> Salvar
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" /> Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash className="h-4 w-4 mr-1" /> Excluir
          </Button>
        </>
      )}
    </div>
  );
};
