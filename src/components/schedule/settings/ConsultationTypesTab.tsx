
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, ListChecks } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Define the consultation type interface
interface ConsultationType {
  id?: string;
  name: string;
  duration: number;
  doctor_id: string;
  created_at?: string;
  updated_at?: string;
}

interface ConsultationTypesTabProps {
  doctorId: string;
}

const ConsultationTypesTab = ({ doctorId }: ConsultationTypesTabProps) => {
  const [consultationTypes, setConsultationTypes] = useState<ConsultationType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newTypeName, setNewTypeName] = useState<string>("");
  const [newTypeDuration, setNewTypeDuration] = useState<number>(30);

  // Fetch consultation types on component mount
  useEffect(() => {
    fetchConsultationTypes();
  }, [doctorId]);

  // Function to fetch consultation types from the database
  const fetchConsultationTypes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('consultation_types')
        .select('*')
        .eq('doctor_id', doctorId);

      if (error) {
        console.error("Error fetching consultation types:", error);
        toast.error("Erro ao carregar tipos de consulta");
      } else if (data) {
        setConsultationTypes(data as ConsultationType[]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao carregar tipos de consulta");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a new consultation type
  const addConsultationType = async () => {
    if (!newTypeName.trim()) {
      toast.error("Nome da consulta é obrigatório");
      return;
    }

    if (newTypeDuration <= 0) {
      toast.error("Duração deve ser maior que zero");
      return;
    }

    setIsLoading(true);
    try {
      const newType: ConsultationType = {
        name: newTypeName.trim(),
        duration: newTypeDuration,
        doctor_id: doctorId
      };

      const { data, error } = await supabase
        .from('consultation_types')
        .insert(newType)
        .select();

      if (error) {
        console.error("Error adding consultation type:", error);
        toast.error("Erro ao adicionar tipo de consulta");
      } else if (data) {
        setConsultationTypes([...consultationTypes, data[0] as ConsultationType]);
        setNewTypeName("");
        setNewTypeDuration(30);
        toast.success("Tipo de consulta adicionado com sucesso");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao adicionar tipo de consulta");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a consultation type
  const deleteConsultationType = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('consultation_types')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting consultation type:", error);
        toast.error("Erro ao excluir tipo de consulta");
      } else {
        setConsultationTypes(consultationTypes.filter(type => type.id !== id));
        toast.success("Tipo de consulta excluído com sucesso");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao excluir tipo de consulta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipos de Consulta</CardTitle>
        <CardDescription>
          Configure os tipos de consulta que você oferece e suas durações.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                onClick={addConsultationType} 
                disabled={isLoading}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </div>
          
          {isLoading && consultationTypes.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Carregando tipos de consulta...
            </div>
          ) : consultationTypes.length === 0 ? (
            <div className="text-center py-4 text-gray-500 border rounded-md">
              <ListChecks className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>Nenhum tipo de consulta configurado</p>
              <p className="text-sm mt-1">Adicione tipos de consulta para que apareçam nas opções de agendamento</p>
            </div>
          ) : (
            <div className="space-y-2 mt-4">
              {consultationTypes.map((type) => (
                <div key={type.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
                  <div>
                    <p className="font-medium">{type.name}</p>
                    <p className="text-sm text-gray-500">{type.duration} minutos</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => type.id && deleteConsultationType(type.id)}
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
      </CardContent>
    </Card>
  );
};

export default ConsultationTypesTab;
