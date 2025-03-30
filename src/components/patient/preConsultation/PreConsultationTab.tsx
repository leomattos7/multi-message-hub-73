
import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { AddGroupDialog } from "./AddGroupDialog";
import { ParameterGroup } from "./ParameterGroup";
import { usePreConsultation } from "./usePreConsultation";

export const PreConsultationTab: React.FC = () => {
  const {
    groups,
    historicalData,
    editingGroupId,
    editingGroupName,
    editingId,
    editingValue,
    editingField,
    addingToGroupId,
    newParameter,
    handleEditGroupName,
    handleSaveGroupName,
    handleCancelEditGroup,
    handleAddGroup,
    handleEdit,
    handleSave,
    handleCancel,
    handleAddNewParameter,
    handleParameterChange,
    handleSaveNewParameter
  } = usePreConsultation();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Histórico do Paciente</h3>
          <AddGroupDialog onAddGroup={handleAddGroup} />
        </div>
        
        <Accordion type="multiple" defaultValue={groups.map(g => g.id)} className="space-y-4">
          {groups.map((group) => (
            <ParameterGroup
              key={group.id}
              group={group}
              editingGroupId={editingGroupId}
              editingGroupName={editingGroupName}
              editingId={editingId}
              editingField={editingField}
              editingValue={editingValue}
              addingToGroupId={addingToGroupId}
              newParameter={newParameter}
              historicalData={historicalData}
              onEditGroupName={handleEditGroupName}
              onSaveGroupName={handleSaveGroupName}
              onCancelEditGroup={handleCancelEditGroup}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onAddNewParameter={handleAddNewParameter}
              onParameterChange={handleParameterChange}
              onSaveNewParameter={handleSaveNewParameter}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
};
