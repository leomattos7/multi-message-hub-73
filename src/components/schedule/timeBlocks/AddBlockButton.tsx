
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddBlockButtonProps {
  onAdd: () => void;
  mode?: "available" | "block";
}

export const AddBlockButton: React.FC<AddBlockButtonProps> = ({ 
  onAdd, 
  mode = "block" 
}) => {
  return (
    <Button 
      variant={mode === "available" ? "available" : "block"}
      className="w-full border-dashed"
      onClick={onAdd}
    >
      <Plus className="mr-2 h-4 w-4" /> 
      Adicionar {mode === "available" ? "disponibilidade" : "bloqueio"}
    </Button>
  );
};
