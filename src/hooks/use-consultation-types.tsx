import { useState } from "react";
import { toast } from "sonner";
import { apiService } from "@/services/api-service";
import { v4 as uuidv4 } from "uuid";

interface ConsultationType {
  id: string;
  name: string;
  duration: number;
}

export const useConsultationTypes = () => {
  const [types, setTypes] = useState<ConsultationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTypes = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get<ConsultationType[]>(
        "/api/consultation_types"
      );
      setTypes(response);
    } catch (error) {
      console.error("Erro ao carregar tipos de consulta:", error);
      toast.error("Erro ao carregar tipos de consulta");
    } finally {
      setIsLoading(false);
    }
  };

  const addType = async (data: Omit<ConsultationType, "id">) => {
    try {
      setIsLoading(true);
      const typeWithId = {
        id: uuidv4(),
        ...data,
      };

      const response = await apiService.post<ConsultationType>(
        "/api/consultation_types",
        typeWithId
      );
      setTypes((prev) => [...prev, response]);
      toast.success("Tipo de consulta adicionado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao adicionar tipo de consulta:", error);
      toast.error("Erro ao adicionar tipo de consulta");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteType = async (id: string) => {
    try {
      setIsLoading(true);
      await apiService.delete(`/api/consultation_types/${id}`);
      setTypes((prev) => prev.filter((type) => type.id !== id));
      toast.success("Tipo de consulta removido com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao remover tipo de consulta:", error);
      toast.error("Erro ao remover tipo de consulta");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    types,
    isLoading,
    fetchTypes,
    addType,
    deleteType,
  };
};
