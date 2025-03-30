
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon, XIcon } from "lucide-react";
import { formatDateLocal } from "./utils";

interface NewParameterRowProps {
  groupId: string;
  newParameter: {
    field: string;
    value: string;
    collectedAt: string;
  };
  onParameterChange: (field: keyof { field: string; value: string; collectedAt: string }, value: string) => void;
  onSave: (groupId: string) => void;
  onCancel: () => void;
}

export const NewParameterRow: React.FC<NewParameterRowProps> = ({
  groupId,
  newParameter,
  onParameterChange,
  onSave,
  onCancel
}) => {
  return (
    <TableRow>
      <TableCell>
        <Input
          value={newParameter.field}
          onChange={(e) => onParameterChange("field", e.target.value)}
          placeholder="Nome do parâmetro"
          className="w-full"
        />
      </TableCell>
      <TableCell>
        <Input
          value={newParameter.value}
          onChange={(e) => onParameterChange("value", e.target.value)}
          placeholder="Descrição"
          className="w-full"
        />
      </TableCell>
      <TableCell>{formatDateLocal(newParameter.collectedAt)}</TableCell>
      <TableCell>
        <div className="flex space-x-1">
          <Button
            size="sm" 
            variant="ghost"
            onClick={() => onSave(groupId)}
          >
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
