
import React from "react";
import { Button } from "@/components/ui/button";

interface DialogActionButtonsProps {
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  isEditMode: boolean;
}

const DialogActionButtons = ({ onClose, onSubmit, isLoading, isEditMode }: DialogActionButtonsProps) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Cancelar
      </Button>
      <Button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? "Salvando..." : (isEditMode ? "Atualizar" : "Salvar")}
      </Button>
    </div>
  );
};

export default DialogActionButtons;
