
import { useState } from "react";
import { ParameterGroup, Parameter, NewParameter } from "./types";
import { initialGroups } from "./mockData";

export function usePatientGroups() {
  const [groups, setGroups] = useState<ParameterGroup[]>(initialGroups);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [editingUnit, setEditingUnit] = useState("");
  const [editingField, setEditingField] = useState("");
  
  const [addingToGroupId, setAddingToGroupId] = useState<string | null>(null);
  const [newParameter, setNewParameter] = useState<NewParameter>({
    field: "",
    value: "",
    unit: "",
    collectedAt: new Date().toISOString()
  });

  // Group management functions
  const handleEditGroupName = (id: string, name: string) => {
    setEditingGroupId(id);
    setEditingGroupName(name);
  };

  const handleSaveGroupName = (id: string) => {
    setGroups(groups.map(group => 
      group.id === id ? { ...group, name: editingGroupName } : group
    ));
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  const handleCancelEditGroup = () => {
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  const handleAddGroup = () => {
    if (newGroupName.trim() !== "") {
      const newId = (Number(groups[groups.length - 1]?.id || "0") + 1).toString();
      setGroups([
        ...groups,
        {
          id: newId,
          name: newGroupName,
          isDefault: false,
          parameters: []
        }
      ]);
      setNewGroupName("");
      return true;
    }
    return false;
  };

  // Parameter management functions
  const handleEdit = (groupId: string, id: string, field: string, value: string, unit: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    setEditingId(id);
    setEditingField(field);
    setEditingValue(value);
    setEditingUnit(unit);
  };

  const handleSave = (groupId: string, id: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          parameters: group.parameters.map(item => 
            item.id === id ? { 
              ...item, 
              field: editingField,
              value: editingValue, 
              unit: editingUnit 
            } : item
          )
        };
      }
      return group;
    }));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    if (addingToGroupId) {
      setAddingToGroupId(null);
      setNewParameter({
        field: "",
        value: "",
        unit: "",
        collectedAt: new Date().toISOString()
      });
    }
  };

  const handleAddNewParameter = (groupId: string) => {
    setAddingToGroupId(groupId);
    setNewParameter({
      field: "",
      value: "",
      unit: "",
      collectedAt: new Date().toISOString()
    });
  };

  const handleSaveNewParameter = (groupId: string) => {
    if (newParameter.field.trim() !== "") {
      // Find largest ID across all parameters to ensure uniqueness
      let maxId = 0;
      groups.forEach(group => {
        group.parameters.forEach(param => {
          const paramId = parseInt(param.id);
          if (!isNaN(paramId) && paramId > maxId) {
            maxId = paramId;
          }
        });
      });

      const newId = (maxId + 1).toString();
      
      setGroups(groups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            parameters: [
              {
                id: newId,
                field: newParameter.field,
                value: newParameter.value,
                unit: newParameter.unit,
                collectedAt: new Date().toISOString()
              },
              ...group.parameters
            ]
          };
        }
        return group;
      }));
      
      setAddingToGroupId(null);
      setNewParameter({
        field: "",
        value: "",
        unit: "",
        collectedAt: new Date().toISOString()
      });
      return true;
    }
    return false;
  };
  
  return {
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
  };
}
