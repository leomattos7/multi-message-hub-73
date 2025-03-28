
import React from "react";
import { AccordionItem, AccordionContent } from "@/components/ui/accordion";
import { GroupHeader } from "./GroupHeader";
import { ParameterTable } from "./ParameterTable";
import { ParameterGroup, NewParameter } from "./types";

interface GroupItemProps {
  group: ParameterGroup;
  editingGroupId: string | null;
  editingGroupName: string;
  editingId: string | null;
  editingField: string;
  editingValue: string;
  editingUnit: string;
  addingToGroupId: string | null;
  newParameter: NewParameter;
  onEditGroupName: (id: string, name: string) => void;
  onSaveGroupName: (id: string) => void;
  onCancelEditGroup: () => void;
  onEditingGroupNameChange: (name: string) => void;
  onEdit: (groupId: string, id: string, field: string, value: string, unit: string) => void;
  onSave: (groupId: string, id: string) => void;
  onCancel: () => void;
  onAddNewParameter: (groupId: string) => void;
  onSaveNewParameter: (groupId: string) => void;
  onParameterChange: (parameter: NewParameter) => void;
}

export const GroupItem: React.FC<GroupItemProps> = ({
  group,
  editingGroupId,
  editingGroupName,
  editingId,
  editingField,
  editingValue,
  editingUnit,
  addingToGroupId,
  newParameter,
  onEditGroupName,
  onSaveGroupName,
  onCancelEditGroup,
  onEditingGroupNameChange,
  onEdit,
  onSave,
  onCancel,
  onAddNewParameter,
  onSaveNewParameter,
  onParameterChange
}) => {
  return (
    <AccordionItem key={group.id} value={group.id} className="border rounded-md">
      <GroupHeader
        groupId={group.id}
        groupName={group.name}
        isEditing={editingGroupId === group.id}
        editingName={editingGroupName}
        onEditName={onEditGroupName}
        onSaveName={onSaveGroupName}
        onCancelEdit={onCancelEditGroup}
        onEditingNameChange={onEditingGroupNameChange}
      />
      <AccordionContent className="px-4 pb-4">
        <ParameterTable
          groupId={group.id}
          parameters={group.parameters}
          editingId={editingId}
          editingField={editingField}
          editingValue={editingValue}
          editingUnit={editingUnit}
          addingToGroupId={addingToGroupId}
          newParameter={newParameter}
          onParameterChange={onParameterChange}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onAddNewParameter={onAddNewParameter}
          onSaveNewParameter={onSaveNewParameter}
        />
      </AccordionContent>
    </AccordionItem>
  );
};
