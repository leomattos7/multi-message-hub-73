
import { useState, useEffect } from "react";
import { NewParameter, ParameterGroup } from "./types";
import { initialGroups, historicalData } from "./mockData";

export const usePatientGroups = () => {
  const [groups, setGroups] = useState<ParameterGroup[]>([]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string>("");
  const [editingValue, setEditingValue] = useState<string>("");
  const [editingUnit, setEditingUnit] = useState<string>("");
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [addingToGroupId, setAddingToGroupId] = useState<string | null>(null);
  const [newParameter, setNewParameter] = useState<NewParameter>({
    field: "",
    value: "",
    unit: "",
    collectedAt: new Date().toISOString()
  });

  // Load initial groups from mock data
  useEffect(() => {
    setGroups(initialGroups);
  }, []);

  // Edit group name
  const handleEditGroupName = (id: string, name: string) => {
    setEditingGroupId(id);
    setEditingGroupName(name);
  };

  // Save edited group name
  const handleSaveGroupName = (id: string) => {
    if (editingGroupName.trim() === "") return;

    setGroups(prev => prev.map(group => {
      if (group.id === id) {
        return { ...group, name: editingGroupName };
      }
      return group;
    }));

    setEditingGroupId(null);
    setEditingGroupName("");
  };

  // Cancel editing group name
  const handleCancelEditGroup = () => {
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  // Add new group
  const handleAddGroup = () => {
    if (newGroupName.trim() === "") return false;

    const newGroup: ParameterGroup = {
      id: `${Date.now()}`,
      name: newGroupName,
      isDefault: false,
      parameters: []
    };

    setGroups(prev => [...prev, newGroup]);
    setNewGroupName("");
    return true;
  };

  // Edit parameter
  const handleEdit = (groupId: string, id: string, field: string, value: string, unit: string) => {
    setEditingId(id);
    setEditingField(field);
    setEditingValue(value);
    setEditingUnit(unit);
  };

  // Save edited parameter
  const handleSave = (groupId: string, id: string) => {
    if (editingField.trim() === "" || editingValue.trim() === "") return;

    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const updatedParameters = group.parameters.map(param => {
          if (param.id === id) {
            return {
              ...param,
              field: editingField,
              value: editingValue,
              unit: editingUnit
            };
          }
          return param;
        });
        return { ...group, parameters: updatedParameters };
      }
      return group;
    }));

    setEditingId(null);
    setEditingField("");
    setEditingValue("");
    setEditingUnit("");
  };

  // Cancel editing parameter
  const handleCancel = () => {
    setEditingId(null);
    setEditingField("");
    setEditingValue("");
    setEditingUnit("");
    setAddingToGroupId(null);
    setNewParameter({
      field: "",
      value: "",
      unit: "",
      collectedAt: new Date().toISOString()
    });
  };

  // Start adding new parameter
  const handleAddNewParameter = (groupId: string) => {
    setAddingToGroupId(groupId);
    setNewParameter({
      field: "",
      value: "",
      unit: "",
      collectedAt: new Date().toISOString()
    });
  };

  // Save new parameter
  const handleSaveNewParameter = (groupId: string) => {
    if (newParameter.field.trim() === "" || newParameter.value.trim() === "") return;

    const newParamWithId = {
      id: `${Date.now()}`,
      ...newParameter
    };

    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          parameters: [...group.parameters, newParamWithId]
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
  };

  return {
    groups,
    editingGroupId,
    editingGroupName,
    setEditingGroupName,
    newGroupName,
    setNewGroupName,
    editingId,
    editingField,
    editingValue,
    editingUnit,
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
};
