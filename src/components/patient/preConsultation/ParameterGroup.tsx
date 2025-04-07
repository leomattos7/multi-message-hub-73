
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, CheckIcon, XIcon, PencilIcon, ChevronDownIcon } from "lucide-react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ParameterRow } from "./ParameterRow";
import { NewParameterRow } from "./NewParameterRow";
import { HistoricalDataMap, NewSubgroupData, ParameterGroup as ParameterGroupType, ParameterSubgroup } from "./types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AddSubgroupDialog } from "./AddSubgroupDialog";

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
  onParameterChange: (field: keyof { field: string; value: string; collectedAt: string }, value: string) => void;
  onSaveNewParameter: (groupId: string) => void;
  onAddNewRecord: (groupId: string, parameterId: string) => void;
  onAddSubgroup?: (groupId: string, subgroupData: NewSubgroupData) => void;
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
  onSaveNewParameter,
  onAddNewRecord,
  onAddSubgroup
}) => {
  const hasSubgroups = group.subgroups && group.subgroups.length > 0;
  const isLifestyleGroup = group.id === "3"; // "Estilo de vida" group ID
  const isSexualReproductiveGroup = group.id === "4"; // "Sexual e reprodutivo" group ID
  const supportsSubgroups = isLifestyleGroup || isSexualReproductiveGroup;

  const handleAddSubgroup = (subgroupData: NewSubgroupData) => {
    if (onAddSubgroup) {
      onAddSubgroup(group.id, subgroupData);
    }
  };

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
        {hasSubgroups ? (
          <div className="space-y-4">
            {group.subgroups?.map((subgroup) => (
              <SubgroupSection 
                key={subgroup.id}
                groupId={group.id}
                subgroup={subgroup}
                editingId={editingId}
                editingField={editingField}
                editingValue={editingValue}
                historicalData={historicalData}
                onEdit={onEdit}
                onSave={onSave}
                onCancel={onCancel}
                onAddNewRecord={onAddNewRecord}
                onAddNewParameter={onAddNewParameter}
              />
            ))}
          </div>
        ) : (
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
                    onAddNewRecord={onAddNewRecord}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex justify-center mt-3">
          {supportsSubgroups && hasSubgroups ? (
            <AddSubgroupDialog onAddSubgroup={handleAddSubgroup} />
          ) : (
            <Button 
              onClick={() => onAddNewParameter(group.id)} 
              variant="outline" 
              size="sm"
              disabled={addingToGroupId === group.id}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Novo Parâmetro
            </Button>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

interface SubgroupSectionProps {
  groupId: string;
  subgroup: ParameterSubgroup;
  editingId: string | null;
  editingField: string;
  editingValue: string;
  historicalData: HistoricalDataMap;
  onEdit: (groupId: string, id: string, field: string, value: string) => void;
  onSave: (groupId: string, id: string) => void;
  onCancel: () => void;
  onAddNewRecord: (groupId: string, parameterId: string) => void;
  onAddNewParameter: (subgroupId: string) => void;
}

const SubgroupSection: React.FC<SubgroupSectionProps> = ({
  groupId,
  subgroup,
  editingId,
  editingField,
  editingValue,
  historicalData,
  onEdit,
  onSave,
  onCancel,
  onAddNewRecord,
  onAddNewParameter
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="border rounded-md">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-medium">{subgroup.name}</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="rounded-md overflow-hidden">
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
                {subgroup.parameters.map((item) => (
                  <ParameterRow
                    key={item.id}
                    groupId={groupId}
                    item={item}
                    editingId={editingId}
                    editingField={editingField}
                    editingValue={editingValue}
                    historicalData={historicalData}
                    onEdit={onEdit}
                    onSave={onSave}
                    onCancel={onCancel}
                    onAddNewRecord={onAddNewRecord}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center mt-3">
            <Button 
              onClick={() => onAddNewParameter(groupId)} 
              variant="outline" 
              size="sm"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Novo Parâmetro
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
