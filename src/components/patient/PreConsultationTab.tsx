
import React from "react";
import { usePatientGroups } from "./preConsultation/usePatientGroups";
import { AddGroupDialog } from "./preConsultation/AddGroupDialog";
import { GroupList } from "./preConsultation/GroupList";

export const PreConsultationTab: React.FC = () => {
  const {
    groups,
    editingGroupId,
    editingGroupName,
    newGroupName,
    setNewGroupName,
    editingId,
    editingValue,
    editingUnit,
    editingField,
    addingToGroupId,
    newParameter,
    setNewParameter,
    handleEditGroupName,
    handleSaveGroupName,
    handleCancelEditGroup,
    handleAddGroup,
    handleEdit,
    handleSave,
    handleCancel,
    handleAddNewParameter,
    handleSaveNewParameter
  } = usePatientGroups();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Histórico do Paciente</h3>
          <AddGroupDialog
            newGroupName={newGroupName}
            onNewGroupNameChange={setNewGroupName}
            onAddGroup={handleAddGroup}
          />
        </div>
        
        <GroupList
          groups={groups}
          editingGroupId={editingGroupId}
          editingGroupName={editingGroupName}
          editingId={editingId}
          editingField={editingField}
          editingValue={editingValue}
          editingUnit={editingUnit}
          addingToGroupId={addingToGroupId}
          newParameter={newParameter}
          onEditGroupName={handleEditGroupName}
          onSaveGroupName={handleSaveGroupName}
          onCancelEditGroup={handleCancelEditGroup}
          onEditingGroupNameChange={setEditingGroupName}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onAddNewParameter={handleAddNewParameter}
          onSaveNewParameter={handleSaveNewParameter}
          onParameterChange={setNewParameter}
        />
      </div>
    </div>
  );
};
