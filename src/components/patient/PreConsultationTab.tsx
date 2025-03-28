
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilIcon, CheckIcon, XIcon, PlusIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
                    item.field
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
