
import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { GroupItem } from "./GroupItem";
import { ParameterGroup, NewParameter } from "./types";

interface GroupListProps {
  groups: ParameterGroup[];
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

export const GroupList: React.FC<GroupListProps> = ({
  groups,
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
    <Accordion type="multiple" defaultValue={groups.map(g => g.id)} className="space-y-4">
      {groups.map((group) => (
        <GroupItem
          key={group.id}
          group={group}
          editingGroupId={editingGroupId}
          editingGroupName={editingGroupName}
          editingId={editingId}
          editingField={editingField}
          editingValue={editingValue}
          editingUnit={editingUnit}
          addingToGroupId={addingToGroupId}
          newParameter={newParameter}
          onEditGroupName={onEditGroupName}
          onSaveGroupName={onSaveGroupName}
          onCancelEditGroup={onCancelEditGroup}
          onEditingGroupNameChange={onEditingGroupNameChange}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onAddNewParameter={onAddNewParameter}
          onSaveNewParameter={onSaveNewParameter}
          onParameterChange={onParameterChange}
        />
      ))}
    </Accordion>
  );
};
