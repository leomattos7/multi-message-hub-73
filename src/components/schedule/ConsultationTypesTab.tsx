import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, ListChecks } from "lucide-react";
import { useConsultationTypes } from "@/hooks/use-consultation-types";

const ConsultationTypesTab: React.FC = () => {
  const { types, isLoading, fetchTypes, addType, deleteType } =
    useConsultationTypes();
  const [newTypeName, setNewTypeName] = useState<string>("");
  const [newTypeDuration, setNewTypeDuration] = useState<number>(30);

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleAddType = async () => {
    if (!newTypeName.trim()) {
      toast.error("Nome da consulta é obrigatório");
      return;
    }

    if (newTypeDuration <= 0) {
      toast.error("Duração deve ser maior que zero");
      return;
    }

    const success = await addType({
      name: newTypeName.trim(),
      duration: newTypeDuration,
    });

    if (success) {
      setNewTypeName("");
      setNewTypeDuration(30);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="type-name">Nome do tipo de consulta</Label>
          <Input
            id="type-name"
            placeholder="Ex: Consulta de rotina"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
          />
        </div>
        <div className="col-span-4">
          <Label htmlFor="type-duration">Duração (minutos)</Label>
          <Input
            id="type-duration"
            type="number"
            placeholder="30"
            min={5}
            value={newTypeDuration}
            onChange={(e) => setNewTypeDuration(parseInt(e.target.value))}
          />
        </div>
        <div className="col-span-2 flex items-end">
          <Button
            onClick={handleAddType}
            disabled={isLoading}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </div>

      {isLoading && types.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Carregando tipos de consulta...
        </div>
      ) : types.length === 0 ? (
        <div className="text-center py-4 text-gray-500 border rounded-md">
          <ListChecks className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p>Nenhum tipo de consulta configurado</p>
          <p className="text-sm mt-1">
            Adicione tipos de consulta para que apareçam nas opções de
            agendamento
          </p>
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          {types.map((type) => (
            <div
              key={type.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-md border"
            >
              <div>
                <p className="font-medium">{type.name}</p>
                <p className="text-sm text-gray-500">{type.duration} minutos</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteType(type.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationTypesTab;
