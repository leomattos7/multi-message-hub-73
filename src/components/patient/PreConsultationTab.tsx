
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";

// Mock data - this won't interact with any database
const initialPreConsultData = [
  { id: "1", field: "Peso", value: "72 kg", unit: "kg" },
  { id: "2", field: "Altura", value: "175", unit: "cm" },
  { id: "3", field: "Pressão Arterial", value: "120/80", unit: "mmHg" },
  { id: "4", field: "Temperatura", value: "36.5", unit: "°C" },
  { id: "5", field: "Frequência Cardíaca", value: "75", unit: "bpm" },
  { id: "6", field: "Frequência Respiratória", value: "16", unit: "irpm" },
  { id: "7", field: "Saturação O2", value: "98", unit: "%" },
  { id: "8", field: "Glicemia", value: "95", unit: "mg/dL" },
];

export const PreConsultationTab: React.FC = () => {
  const [preConsultData, setPreConsultData] = useState(initialPreConsultData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const handleEdit = (id: string, value: string) => {
    setEditingId(id);
    setEditingValue(value);
  };

  const handleSave = (id: string) => {
    setPreConsultData(
      preConsultData.map((item) =>
        item.id === id ? { ...item, value: editingValue } : item
      )
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-4">Dados da Pré-Consulta</h3>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parâmetro</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {preConsultData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.field}</TableCell>
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
                <TableCell>{item.unit}</TableCell>
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
                      onClick={() => handleEdit(item.id, item.value)}
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
