
import React from "react";
import { PlusIcon } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Parameter, NewParameter } from "./types";
import { ParameterItem } from "./ParameterItem";
import { NewParameterForm } from "./NewParameterForm";

interface ParameterTableProps {
  groupId: string;
  parameters: Parameter[];
  editingId: string | null;
  editingField: string;
  editingValue: string;
  editingUnit: string;
  addingToGroupId: string | null;
  newParameter: NewParameter;
  onParameterChange: (parameter: NewParameter) => void;
  onEdit: (groupId: string, id: string, field: string, value: string, unit: string) => void;
  onSave: (groupId: string, id: string) => void;
  onCancel: () => void;
  onAddNewParameter: (groupId: string) => void;
  onSaveNewParameter: (groupId: string) => void;
}

export const ParameterTable: React.FC<ParameterTableProps> = ({
  groupId,
  parameters,
  editingId,
  editingField,
  editingValue,
  editingUnit,
  addingToGroupId,
  newParameter,
  onParameterChange,
  onEdit,
  onSave,
  onCancel,
  onAddNewParameter,
  onSaveNewParameter
}) => {
  return (
    <div className="space-y-3">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parâmetro</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Data de Registro</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addingToGroupId === groupId && (
              <NewParameterForm
                newParameter={newParameter}
                onParameterChange={onParameterChange}
                onSave={() => onSaveNewParameter(groupId)}
                onCancel={onCancel}
              />
            )}
            {parameters.map((item) => (
              <ParameterItem
                key={item.id}
                groupId={groupId}
                parameter={item}
                isEditing={editingId === item.id}
                editingField={editingField}
                editingValue={editingValue}
                editingUnit={editingUnit}
                onEdit={onEdit}
                onSave={onSave}
                onCancel={onCancel}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center">
        <Button 
          onClick={() => onAddNewParameter(groupId)} 
          variant="outline" 
          size="sm"
          disabled={addingToGroupId === groupId}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Novo Parâmetro
        </Button>
      </div>
    </div>
  );
};
