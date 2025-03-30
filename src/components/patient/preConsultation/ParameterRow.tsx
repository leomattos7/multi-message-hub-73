
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";
import { ParameterHistory } from "./ParameterHistory";
import { HistoricalDataMap, ParameterItem } from "./types";
import { formatDateLocal } from "./utils";

interface ParameterRowProps {
  groupId: string;
  item: ParameterItem;
  editingId: string | null;
  editingField: string;
  editingValue: string;
  historicalData: HistoricalDataMap;
  onEdit: (groupId: string, id: string, field: string, value: string) => void;
  onSave: (groupId: string, id: string) => void;
  onCancel: () => void;
}

export const ParameterRow: React.FC<ParameterRowProps> = ({
  groupId,
  item,
  editingId,
  editingField,
  editingValue,
  historicalData,
  onEdit,
  onSave,
  onCancel
}) => {
  const isEditing = editingId === item.id;

  return (
    <TableRow>
      <TableCell className="font-medium">
        {isEditing ? (
          <Input
            value={editingField}
            onChange={(e) => onEdit(groupId, item.id, e.target.value, editingValue)}
            className="w-full"
          />
        ) : (
          <ParameterHistory item={item} historicalData={historicalData} />
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editingValue}
            onChange={(e) => onEdit(groupId, item.id, editingField, e.target.value)}
            className="w-full"
          />
        ) : (
          item.value
        )}
      </TableCell>
      <TableCell>{formatDateLocal(item.collectedAt)}</TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex space-x-1">
            <Button
              size="sm" 
              variant="ghost"
              onClick={() => onSave(groupId, item.id)}
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
            onClick={() => onEdit(groupId, item.id, item.field, item.value)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
