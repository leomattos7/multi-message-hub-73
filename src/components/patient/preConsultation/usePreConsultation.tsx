
import { useState } from "react";
import { NewSubgroupData, ParameterGroup, ParameterItem, HistoricalDataMap } from "./types";
import { initialGroups, historicalData as initialHistoricalData } from "./mockData";

export const usePreConsultation = () => {
  const [groups, setGroups] = useState<ParameterGroup[]>(initialGroups);
  const [historicalData, setHistoricalData] = useState<HistoricalDataMap>(initialHistoricalData);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [editingField, setEditingField] = useState("");
  const [addingToGroupId, setAddingToGroupId] = useState<string | null>(null);
  const [newParameter, setNewParameter] = useState({
    field: "",
    value: "",
    collectedAt: new Date().toISOString()
  });

  // Handle group editing
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

  const handleAddGroup = (newGroupName: string) => {
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
    }
  };

  // Add a new subgroup to a specific group
  const handleAddSubgroup = (groupId: string, subgroupData: NewSubgroupData) => {
    if (subgroupData.name.trim() === "") return;
    
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        const subgroups = group.subgroups || [];
        const newSubgroupId = `${groupId}-${(subgroups.length + 1)}`;
        
        return {
          ...group,
          subgroups: [
            ...subgroups,
            {
              id: newSubgroupId,
              name: subgroupData.name,
              parameters: []
            }
          ]
        };
      }
      return group;
    }));
  };

  // Handle parameter editing
  const handleEdit = (groupId: string, id: string, field: string, value: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    setEditingId(id);
    setEditingField(field);
    setEditingValue(value);
  };

  const handleSave = (groupId: string, id: string) => {
    // Find the parameter to update
    let parameter: ParameterItem | undefined;
    let foundInSubgroup = false;
    
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    // Check if the parameter is in the main parameters array
    parameter = group.parameters.find(p => p.id === id);
    
    // If not found in main parameters, check in subgroups
    if (!parameter && group.subgroups) {
      for (const subgroup of group.subgroups) {
        parameter = subgroup.parameters.find(p => p.id === id);
        if (parameter) {
          foundInSubgroup = true;
          break;
        }
      }
    }
    
    if (!parameter) return;
    
    // Save current value to history before updating
    const updatedHistoricalData = { ...historicalData };
    
    // Initialize history array if it doesn't exist
    if (!updatedHistoricalData[id]) {
      updatedHistoricalData[id] = [];
    }
    
    // Add current value to history
    updatedHistoricalData[id].unshift({
      value: parameter.value,
      collectedAt: parameter.collectedAt
    });
    
    // Update the parameter with new values
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        // If parameter is in main parameters array
        if (!foundInSubgroup) {
          return {
            ...group,
            parameters: group.parameters.map(item => 
              item.id === id ? { 
                ...item, 
                field: editingField,
                value: editingValue,
                collectedAt: new Date().toISOString()
              } : item
            )
          };
        } 
        // If parameter is in a subgroup
        else if (group.subgroups) {
          return {
            ...group,
            subgroups: group.subgroups.map(subgroup => ({
              ...subgroup,
              parameters: subgroup.parameters.map(item => 
                item.id === id ? { 
                  ...item, 
                  field: editingField,
                  value: editingValue,
                  collectedAt: new Date().toISOString()
                } : item
              )
            }))
          };
        }
      }
      return group;
    }));
    
    // Update historical data
    setHistoricalData(updatedHistoricalData);
    
    // Clear editing state
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    if (addingToGroupId) {
      setAddingToGroupId(null);
      setNewParameter({
        field: "",
        value: "",
        collectedAt: new Date().toISOString()
      });
    }
  };

  const handleAddNewParameter = (groupId: string) => {
    setAddingToGroupId(groupId);
    setNewParameter({
      field: "",
      value: "",
      collectedAt: new Date().toISOString()
    });
  };

  const handleParameterChange = (field: keyof typeof newParameter, value: string) => {
    setNewParameter(prev => ({
      ...prev,
      [field]: value
    }));
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
        
        if (group.subgroups) {
          group.subgroups.forEach(subgroup => {
            subgroup.parameters.forEach(param => {
              const paramId = parseInt(param.id);
              if (!isNaN(paramId) && paramId > maxId) {
                maxId = paramId;
              }
            });
          });
        }
      });

      const newId = (maxId + 1).toString();
      const currentTimestamp = new Date().toISOString();
      
      // Check if we're adding to a subgroup
      const [parentGroupId, subgroupId] = groupId.includes('-') ? groupId.split('-') : [groupId, null];
      
      // Update groups with new parameter
      setGroups(groups.map(group => {
        // If adding to main group
        if (group.id === groupId && !subgroupId) {
          return {
            ...group,
            parameters: [
              {
                id: newId,
                field: newParameter.field,
                value: newParameter.value,
                collectedAt: currentTimestamp
              },
              ...group.parameters
            ]
          };
        }
        // If adding to a subgroup
        else if (group.id === parentGroupId && subgroupId && group.subgroups) {
          return {
            ...group,
            subgroups: group.subgroups.map(subgroup => 
              subgroup.id === groupId ? {
                ...subgroup,
                parameters: [
                  {
                    id: newId,
                    field: newParameter.field,
                    value: newParameter.value,
                    collectedAt: currentTimestamp
                  },
                  ...subgroup.parameters
                ]
              } : subgroup
            )
          };
        }
        return group;
      }));
      
      // Initialize history for new parameter
      setHistoricalData(prev => ({
        ...prev,
        [newId]: []
      }));
      
      // Reset form state
      setAddingToGroupId(null);
      setNewParameter({
        field: "",
        value: "",
        collectedAt: new Date().toISOString()
      });
    }
  };

  // Add a new record for an existing parameter
  const handleAddNewRecord = (groupId: string, parameterId: string) => {
    // Find the parameter
    let parameter: ParameterItem | undefined;
    let foundInSubgroup = false;
    let subgroupId: string | null = null;
    
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    // Check if the parameter is in the main parameters array
    parameter = group.parameters.find(p => p.id === parameterId);
    
    // If not found in main parameters, check in subgroups
    if (!parameter && group.subgroups) {
      for (const subgroup of group.subgroups) {
        parameter = subgroup.parameters.find(p => p.id === parameterId);
        if (parameter) {
          foundInSubgroup = true;
          subgroupId = subgroup.id;
          break;
        }
      }
    }
    
    if (!parameter) return;
    
    // Save current value to history
    const updatedHistoricalData = { ...historicalData };
    
    // Initialize history array if it doesn't exist
    if (!updatedHistoricalData[parameterId]) {
      updatedHistoricalData[parameterId] = [];
    }
    
    // Add current value to history
    updatedHistoricalData[parameterId].unshift({
      value: parameter.value,
      collectedAt: parameter.collectedAt
    });
    
    // Update the parameter with new values
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        if (!foundInSubgroup) {
          return {
            ...group,
            parameters: group.parameters.map(item => 
              item.id === parameterId ? { 
                ...item,
                value: "", // Clear the value for user to input
                collectedAt: new Date().toISOString()
              } : item
            )
          };
        } else if (group.subgroups && subgroupId) {
          return {
            ...group,
            subgroups: group.subgroups.map(subgroup => 
              subgroup.id === subgroupId ? {
                ...subgroup,
                parameters: subgroup.parameters.map(item => 
                  item.id === parameterId ? { 
                    ...item,
                    value: "", // Clear the value for user to input
                    collectedAt: new Date().toISOString()
                  } : item
                )
              } : subgroup
            )
          };
        }
      }
      return group;
    }));
    
    // Update historical data
    setHistoricalData(updatedHistoricalData);
    
    // Set to editing mode for the parameter
    setEditingId(parameterId);
    setEditingField(parameter.field);
    setEditingValue("");
  };

  return {
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
    handleAddSubgroup,
    handleEdit,
    handleSave,
    handleCancel,
    handleAddNewParameter,
    handleParameterChange,
    handleSaveNewParameter,
    handleAddNewRecord
  };
};
