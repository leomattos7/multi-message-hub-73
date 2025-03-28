
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilIcon, CheckIcon, XIcon, PlusIcon, HistoryIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
};

// Mock data - this won't interact with any database
const initialPreConsultData = [
  { id: "1", field: "Peso", value: "72 kg", unit: "kg", collectedAt: new Date().toISOString() },
  { id: "2", field: "Altura", value: "175", unit: "cm", collectedAt: new Date().toISOString() },
  { id: "3", field: "Pressão Arterial", value: "120/80", unit: "mmHg", collectedAt: new Date().toISOString() },
  { id: "4", field: "Temperatura", value: "36.5", unit: "°C", collectedAt: new Date().toISOString() },
  { id: "5", field: "Frequência Cardíaca", value: "75", unit: "bpm", collectedAt: new Date().toISOString() },
  { id: "6", field: "Frequência Respiratória", value: "16", unit: "irpm", collectedAt: new Date().toISOString() },
  { id: "7", field: "Saturação O2", value: "98", unit: "%", collectedAt: new Date().toISOString() },
  { id: "8", field: "Glicemia", value: "95", unit: "mg/dL", collectedAt: new Date().toISOString() },
];

export const PreConsultationTab: React.FC = () => {
  const [preConsultData, setPreConsultData] = useState(initialPreConsultData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [editingUnit, setEditingUnit] = useState("");
  const [editingField, setEditingField] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newParameter, setNewParameter] = useState({
    field: "",
    value: "",
    unit: "",
    collectedAt: new Date().toISOString()
  });

  const handleEdit = (id: string, field: string, value: string, unit: string) => {
    setEditingId(id);
    setEditingField(field);
    setEditingValue(value);
    setEditingUnit(unit);
  };

  const handleSave = (id: string) => {
    setPreConsultData(
      preConsultData.map((item) =>
        item.id === id ? { 
          ...item, 
          field: editingField,
          value: editingValue, 
          unit: editingUnit 
        } : item
      )
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    if (isAddingNew) {
      setIsAddingNew(false);
      setNewParameter({
        field: "",
        value: "",
        unit: "",
        collectedAt: new Date().toISOString()
      });
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
  };

  const handleSaveNew = () => {
    if (newParameter.field.trim() !== "") {
      const newId = (preConsultData.length + 1).toString();
      setPreConsultData([
        {
          id: newId,
          field: newParameter.field,
          value: newParameter.value,
          unit: newParameter.unit,
          collectedAt: new Date().toISOString()
        },
        ...preConsultData
      ]);
      setIsAddingNew(false);
      setNewParameter({
        field: "",
        value: "",
        unit: "",
        collectedAt: new Date().toISOString()
      });
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  // Get historic data for a parameter
  const getParameterHistory = (id: string) => {
    return historicalData[id as keyof typeof historicalData] || [];
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Dados da Pré-Consulta</h3>
          <Button 
            onClick={handleAddNew} 
            variant="outline" 
            size="sm"
            disabled={isAddingNew}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Novo Parâmetro
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parâmetro</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Data de Registro</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAddingNew && (
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
                <TableCell>{formatDate(newParameter.collectedAt)}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      size="sm" 
                      variant="ghost"
                      onClick={handleSaveNew}
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
            {preConsultData.map((item) => (
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
                                {getParameterHistory(item.id).map((historyItem, index) => (
                                  <div key={index} className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded">
                                    <div>
                                      <span className="font-medium">{historyItem.value}</span> {historyItem.unit}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {formatDate(historyItem.collectedAt)}
                                    </div>
                                  </div>
                                ))}
                                <div className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded border border-blue-200">
                                  <div>
                                    <span className="font-medium">{item.value}</span> {item.unit}
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded mr-1">Atual</span>
                                    {formatDate(item.collectedAt)}
                                  </div>
                                </div>
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
                <TableCell>{formatDate(item.collectedAt)}</TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <div className="flex space-x-1">
                      <Button
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleSave(item.id)}
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
                      onClick={() => handleEdit(item.id, item.field, item.value, item.unit)}
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
    </div>
  );
};
