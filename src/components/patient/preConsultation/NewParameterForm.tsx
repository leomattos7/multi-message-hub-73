
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon, XIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NewParameter } from "./types";

interface NewParameterFormProps {
  newParameter: NewParameter;
  onParameterChange: (parameter: NewParameter) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const NewParameterForm: React.FC<NewParameterFormProps> = ({
  newParameter,
  onParameterChange,
  onSave,
  onCancel
}) => {
  const formatDateLocal = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  return (
    <TableRow>
      <TableCell>
        <Input
          value={newParameter.field}
          onChange={(e) => onParameterChange({...newParameter, field: e.target.value})}
          placeholder="Nome do parâmetro"
          className="w-full"
        />
      </TableCell>
      <TableCell>
        <Input
          value={newParameter.value}
          onChange={(e) => onParameterChange({...newParameter, value: e.target.value})}
          placeholder="Valor"
          className="w-full"
        />
      </TableCell>
      <TableCell>
        <Input
          value={newParameter.unit}
          onChange={(e) => onParameterChange({...newParameter, unit: e.target.value})}
          placeholder="Unidade"
          className="w-full"
        />
      </TableCell>
      <TableCell>{formatDateLocal(newParameter.collectedAt)}</TableCell>
      <TableCell>
        <div className="flex space-x-1">
          <Button
            size="sm" 
            variant="ghost"
            onClick={onSave}
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
