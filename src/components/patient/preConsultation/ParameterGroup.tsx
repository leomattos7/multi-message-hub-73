
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, CheckIcon, XIcon, PencilIcon } from "lucide-react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ParameterRow } from "./ParameterRow";
import { NewParameterRow } from "./NewParameterRow";
import { HistoricalDataMap, ParameterGroup as ParameterGroupType } from "./types";

interface ParameterGroupProps {
  group: ParameterGroupType;
  editingGroupId: string | null;
  editingGroupName: string;
  editingId: string | null;
  editingField: string;
  editingValue: string;
  addingToGroupId: string | null;
  newParameter: { field: string; value: string; collectedAt: string };
  historicalData: HistoricalDataMap;
  onEditGroupName: (id: string, name: string) => void;
  onSaveGroupName: (id: string) => void;
  onCancelEditGroup: () => void;
  onEdit: (groupId: string, id: string, field: string, value: string) => void;
  onSave: (groupId: string, id: string) => void;
  onCancel: () => void;
  onAddNewParameter: (groupId: string) => void;
  onParameterChange: (field: keyof typeof newParameter, value: string) => void;
  onSaveNewParameter: (groupId: string) => void;
}

export const ParameterGroup: React.FC<ParameterGroupProps> = ({
  group,
  editingGroupId,
  editingGroupName,
  editingId,
  editingField,
  editingValue,
  addingToGroupId,
  newParameter,
  historicalData,
  onEditGroupName,
  onSaveGroupName,
  onCancelEditGroup,
  onEdit,
  onSave,
  onCancel,
  onAddNewParameter,
  onParameterChange,
  onSaveNewParameter
}) => {
  return (
    <AccordionItem key={group.id} value={group.id} className="border rounded-md">
      <div className="flex justify-between items-center px-4">
        <AccordionTrigger className="py-3">
          {editingGroupId === group.id ? (
            <Input
              value={editingGroupName}
              onChange={(e) => onEditGroupName(group.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[300px]"
            />
          ) : (
            <span>{group.name}</span>
          )}
        </AccordionTrigger>
        <div className="flex space-x-1">
          {editingGroupId === group.id ? (
            <>
              <Button
                size="sm" 
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveGroupName(group.id);
                }}
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelEditGroup();
                }}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEditGroupName(group.id, group.name);
              }}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <AccordionContent className="px-4 pb-4">
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parâmetro</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data de Registro</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addingToGroupId === group.id && (
                <NewParameterRow
                  groupId={group.id}
                  newParameter={newParameter}
                  onParameterChange={onParameterChange}
                  onSave={onSaveNewParameter}
                  onCancel={onCancel}
                />
              )}
              {group.parameters.map((item) => (
                <ParameterRow
                  key={item.id}
                  groupId={group.id}
                  item={item}
                  editingId={editingId}
                  editingField={editingField}
                  editingValue={editingValue}
                  historicalData={historicalData}
                  onEdit={onEdit}
                  onSave={onSave}
                  onCancel={onCancel}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center mt-3">
          <Button 
            onClick={() => onAddNewParameter(group.id)} 
            variant="outline" 
            size="sm"
            disabled={addingToGroupId === group.id}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Novo Parâmetro
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
