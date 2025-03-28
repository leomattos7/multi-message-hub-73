
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilIcon, CheckIcon, XIcon, PlusIcon, HistoryIcon, Settings2Icon, BotIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/utils/records-utils";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock historical data for each parameter
const historicalData = {
  "1": [
    { value: "70 kg", unit: "kg", collectedAt: new Date(2023, 11, 15).toISOString() },
    { value: "71 kg", unit: "kg", collectedAt: new Date(2023, 10, 20).toISOString() },
    { value: "73 kg", unit: "kg", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "2": [
    { value: "174", unit: "cm", collectedAt: new Date(2023, 10, 15).toISOString() },
    { value: "175", unit: "cm", collectedAt: new Date(2023, 6, 10).toISOString() },
  ],
  "3": [
    { value: "118/78", unit: "mmHg", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "120/82", unit: "mmHg", collectedAt: new Date(2023, 10, 5).toISOString() },
    { value: "125/85", unit: "mmHg", collectedAt: new Date(2023, 9, 1).toISOString() },
    { value: "130/90", unit: "mmHg", collectedAt: new Date(2023, 8, 15).toISOString() },
  ],
  "4": [
    { value: "36.7", unit: "°C", collectedAt: new Date(2023, 11, 5).toISOString() },
    { value: "37.1", unit: "°C", collectedAt: new Date(2023, 10, 20).toISOString() },
    { value: "36.5", unit: "°C", collectedAt: new Date(2023, 9, 10).toISOString() },
  ],
  "5": [
    { value: "72", unit: "bpm", collectedAt: new Date(2023, 11, 5).toISOString() },
    { value: "76", unit: "bpm", collectedAt: new Date(2023, 10, 15).toISOString() },
    { value: "75", unit: "bpm", collectedAt: new Date(2023, 9, 1).toISOString() },
  ],
  "6": [
    { value: "15", unit: "irpm", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "16", unit: "irpm", collectedAt: new Date(2023, 9, 15).toISOString() },
  ],
  "7": [
    { value: "97", unit: "%", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "98", unit: "%", collectedAt: new Date(2023, 9, 5).toISOString() },
    { value: "96", unit: "%", collectedAt: new Date(2023, 7, 20).toISOString() },
  ],
  "8": [
    { value: "92", unit: "mg/dL", collectedAt: new Date(2023, 11, 5).toISOString() },
    { value: "95", unit: "mg/dL", collectedAt: new Date(2023, 9, 10).toISOString() },
    { value: "98", unit: "mg/dL", collectedAt: new Date(2023, 7, 15).toISOString() },
    { value: "100", unit: "mg/dL", collectedAt: new Date(2023, 5, 1).toISOString() },
  ],
  "9": [
    { value: "Sim", unit: "", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Não", unit: "", collectedAt: new Date(2023, 8, 15).toISOString() },
  ],
  "10": [
    { value: "2x/semana", unit: "", collectedAt: new Date(2023, 11, 5).toISOString() },
    { value: "3x/semana", unit: "", collectedAt: new Date(2023, 8, 20).toISOString() },
  ],
  "11": [
    { value: "Sim", unit: "", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Não", unit: "", collectedAt: new Date(2023, 9, 1).toISOString() },
  ],
  "12": [
    { value: "Regular", unit: "", collectedAt: new Date(2023, 11, 15).toISOString() },
    { value: "Irregular", unit: "", collectedAt: new Date(2023, 7, 10).toISOString() },
  ],
};

// Initial groups
const initialGroups = [
  { 
    id: "1", 
    name: "Dados gerais",
    isDefault: true,
    parameters: [
      { id: "1", field: "Peso", value: "72 kg", unit: "kg", collectedAt: new Date().toISOString(), createdBy: "human" },
      { id: "2", field: "Altura", value: "175", unit: "cm", collectedAt: new Date().toISOString(), createdBy: "ai" },
      { id: "3", field: "Pressão Arterial", value: "120/80", unit: "mmHg", collectedAt: new Date().toISOString(), createdBy: "human" },
      { id: "4", field: "Temperatura", value: "36.5", unit: "°C", collectedAt: new Date().toISOString(), createdBy: "ai" },
      { id: "5", field: "Frequência Cardíaca", value: "75", unit: "bpm", collectedAt: new Date().toISOString(), createdBy: "human" },
      { id: "6", field: "Frequência Respiratória", value: "16", unit: "irpm", collectedAt: new Date().toISOString(), createdBy: "ai" },
      { id: "7", field: "Saturação O2", value: "98", unit: "%", collectedAt: new Date().toISOString(), createdBy: "human" },
      { id: "8", field: "Glicemia", value: "95", unit: "mg/dL", collectedAt: new Date().toISOString(), createdBy: "ai" },
    ] 
  },
  { 
    id: "2", 
    name: "Histórico Familiar",
    isDefault: true,
    parameters: [
      { id: "9", field: "Diabetes na família", value: "Sim", unit: "", collectedAt: new Date().toISOString(), createdBy: "human" },
    ]
  },
  { 
    id: "3", 
    name: "Estilo de vida",
    isDefault: true,
    parameters: [
      { id: "10", field: "Atividade física", value: "2x/semana", unit: "", collectedAt: new Date().toISOString(), createdBy: "ai" },
      { id: "11", field: "Tabagismo", value: "Não", unit: "", collectedAt: new Date().toISOString(), createdBy: "human" },
    ]
  },
  { 
    id: "4", 
    name: "Sexual e reprodutivo",
    isDefault: true,
    parameters: [
      { id: "12", field: "Ciclo menstrual", value: "Regular", unit: "", collectedAt: new Date().toISOString(), createdBy: "ai" },
    ]
  },
];

// Also update the historicalData to include the createdBy property
for (const id in historicalData) {
  historicalData[id as keyof typeof historicalData].forEach((item, index) => {
    // Alternate between human and AI for the historical data
    item.createdBy = index % 2 === 0 ? "human" : "ai";
  });
}

export const PreConsultationTab: React.FC = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [editingUnit, setEditingUnit] = useState("");
  const [editingField, setEditingField] = useState("");
  
  const [addingToGroupId, setAddingToGroupId] = useState<string | null>(null);
  const [newParameter, setNewParameter] = useState({
    field: "",
    value: "",
    unit: "",
    collectedAt: new Date().toISOString(),
    createdBy: "human" // Default to human for new parameters
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
      setIsAddingGroup(false);
      setNewGroupName("");
    }
  };

  // Handle parameter editing
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
                collectedAt: new Date().toISOString(),
                createdBy: newParameter.createdBy
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
        collectedAt: new Date().toISOString(),
        createdBy: "human"
      });
    }
  };

  const formatDateLocal = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  // Get historic data for a parameter and sort by date (newest first)
  const getParameterHistory = (id: string) => {
    const history = historicalData[id as keyof typeof historicalData] || [];
    
    // Sort history by date, newest first
    return [...history].sort((a, b) => {
      return new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime();
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Dados da Pré-Consulta</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Novo Grupo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Grupo</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Nome do grupo"
                  className="w-full"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingGroup(false)}>Cancelar</Button>
                <Button onClick={handleAddGroup}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Accordion type="multiple" defaultValue={groups.map(g => g.id)} className="space-y-4">
          {groups.map((group) => (
            <AccordionItem key={group.id} value={group.id} className="border rounded-md">
              <div className="flex justify-between items-center px-4">
                <AccordionTrigger className="py-3">
                  {editingGroupId === group.id ? (
                    <Input
                      value={editingGroupName}
                      onChange={(e) => setEditingGroupName(e.target.value)}
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
                          handleSaveGroupName(group.id);
                        }}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelEditGroup();
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
                        handleEditGroupName(group.id, group.name);
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
                        <TableHead>Valor</TableHead>
                        <TableHead>Unidade</TableHead>
                        <TableHead>Data de Registro</TableHead>
                        <TableHead>Origem</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {addingToGroupId === group.id && (
                        <TableRow>
                          <TableCell>
                            <Input
                              value={newParameter.field}
                              onChange={(e) => setNewParameter({...newParameter, field: e.target.value})}
                              placeholder="Nome do parâmetro"
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={newParameter.value}
                              onChange={(e) => setNewParameter({...newParameter, value: e.target.value})}
                              placeholder="Valor"
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={newParameter.unit}
                              onChange={(e) => setNewParameter({...newParameter, unit: e.target.value})}
                              placeholder="Unidade"
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>{formatDateLocal(newParameter.collectedAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-8 w-8 p-0 ${newParameter.createdBy === "human" ? "bg-blue-100" : ""}`}
                                onClick={() => setNewParameter({...newParameter, createdBy: "human"})}
                              >
                                <UserIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-8 w-8 p-0 ${newParameter.createdBy === "ai" ? "bg-green-100" : ""}`}
                                onClick={() => setNewParameter({...newParameter, createdBy: "ai"})}
                              >
                                <BotIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleSaveNewParameter(group.id)}
                              >
                                <CheckIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancel}
                              >
                                <XIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {group.parameters.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {editingId === item.id ? (
                              <Input
                                value={editingField}
                                onChange={(e) => setEditingField(e.target.value)}
                                className="w-full"
                              />
                            ) : (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button 
                                    variant="link" 
                                    className="p-0 h-auto font-medium text-left hover:underline"
                                  >
                                    {item.field}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <HistoryIcon className="h-4 w-4 text-blue-500" />
                                      <h4 className="font-semibold text-sm">Histórico de {item.field}</h4>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                      {getParameterHistory(item.id).length > 0 ? (
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                          <div className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded border border-blue-200">
                                            <div className="flex items-center space-x-2">
                                              <span className="font-medium">{item.value}</span> {item.unit}
                                              {item.createdBy === "human" ? (
                                                <TooltipProvider>
                                                  <Tooltip>
                                                    <TooltipTrigger>
                                                      <UserIcon className="h-3.5 w-3.5 text-blue-600" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      <p>Input humano</p>
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TooltipProvider>
                                              ) : (
                                                <TooltipProvider>
                                                  <Tooltip>
                                                    <TooltipTrigger>
                                                      <BotIcon className="h-3.5 w-3.5 text-green-600" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      <p>Assistente IA</p>
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TooltipProvider>
                                              )}
                                            </div>
                                            <div className="text-xs text-muted-foreground flex items-center">
                                              <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded mr-1">Atual</span>
                                              {formatDateLocal(item.collectedAt)}
                                            </div>
                                          </div>
                                          {getParameterHistory(item.id).map((historyItem, index) => (
                                            <div key={index} className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded">
                                              <div className="flex items-center space-x-2">
                                                <span className="font-medium">{historyItem.value}</span> {historyItem.unit}
                                                {historyItem.createdBy === "human" ? (
                                                  <TooltipProvider>
                                                    <Tooltip>
                                                      <TooltipTrigger>
                                                        <UserIcon className="h-3.5 w-3.5 text-blue-600" />
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                        <p>Input humano</p>
                                                      </TooltipContent>
                                                    </Tooltip>
                                                  </TooltipProvider>
                                                ) : (
                                                  <TooltipProvider>
                                                    <Tooltip>
                                                      <TooltipTrigger>
                                                        <BotIcon className="h-3.5 w-3.5 text-green-600" />
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                        <p>Assistente IA</p>
                                                      </TooltipContent>
                                                    </Tooltip>
                                                  </TooltipProvider>
                                                )}
                                              </div>
                                              <div className="text-xs text-muted-foreground">
                                                {formatDateLocal(historyItem.collectedAt)}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-sm text-muted-foreground py-2">
                                          Não há registros históricos para este parâmetro.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === item.id ? (
                              <Input
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="w-full"
                              />
                            ) : (
                              item.value
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === item.id ? (
                              <Input
                                value={editingUnit}
                                onChange={(e) => setEditingUnit(e.target.value)}
                                className="w-full"
                              />
                            ) : (
                              item.unit
                            )}
                          </TableCell>
                          <TableCell>{formatDateLocal(item.collectedAt)}</TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  {item.createdBy === "human" ? (
                                    <UserIcon className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <BotIcon className="h-4 w-4 text-green-600" />
                                  )}
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{item.createdBy === "human" ? "Input humano" : "Assistente IA"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            {editingId === item.id ? (
                              <div className="flex space-x-1">
                                <Button
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleSave(group.id, item.id)}
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleCancel}
                                >
                                  <XIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(group.id, item.id, item.field, item.value, item.unit)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-center mt-3">
                  <Button 
                    onClick={() => handleAddNewParameter(group.id)} 
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
          ))}
        </Accordion>
      </div>
    </div>
  );
};
