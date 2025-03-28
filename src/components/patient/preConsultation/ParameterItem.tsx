
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Parameter } from "./types";
import { ParameterHistoryDisplay } from "./ParameterHistory";

interface ParameterItemProps {
  groupId: string;
  parameter: Parameter;
  isEditing: boolean;
  editingField: string;
  editingValue: string;
  editingUnit: string;
  onEdit: (groupId: string, id: string, field: string, value: string, unit: string) => void;
  onSave: (groupId: string, id: string) => void;
  onCancel: () => void;
}

export const ParameterItem: React.FC<ParameterItemProps> = ({
  groupId,
  parameter,
  isEditing,
  editingField,
  editingValue,
  editingUnit,
  onEdit,
  onSave,
  onCancel
}) => {
  const formatDateLocal = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {isEditing ? (
          <Input
            value={editingField}
            onChange={(e) => editingField = e.target.value}
            className="w-full"
          />
        ) : (
          <ParameterHistoryDisplay
            parameterId={parameter.id}
            field={parameter.field}
            currentValue={parameter.value}
            currentUnit={parameter.unit}
            currentDate={parameter.collectedAt}
          />
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editingValue}
            onChange={(e) => editingValue = e.target.value}
            className="w-full"
          />
        ) : (
          parameter.value
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editingUnit}
            onChange={(e) => editingUnit = e.target.value}
            className="w-full"
          />
        ) : (
          parameter.unit
        )}
      </TableCell>
      <TableCell>{formatDateLocal(parameter.collectedAt)}</TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex space-x-1">
            <Button
              size="sm" 
              variant="ghost"
              onClick={() => onSave(groupId, parameter.id)}
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
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(groupId, parameter.id, parameter.field, parameter.value, parameter.unit)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
