import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiService } from "@/services/api-service";

interface Option {
  id: string;
  name: string;
}

export const useConsultationOptions = () => {
  const [types, setTypes] = useState<Option[]>([]);
  const [status, setStatus] = useState<Option[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOptions = async () => {
    try {
      setIsLoading(true);

      const [typesResponse, statusResponse, paymentsResponse] =
        await Promise.all([
          apiService.get<Option[]>("/api/consultation_types"),
          apiService.get<Option[]>("/api/consultation_status"),
          apiService.get<Option[]>("/api/consultation_payments_methods"),
        ]);

      setTypes(typesResponse);
      setStatus(statusResponse);
      setPaymentMethods(paymentsResponse);
    } catch (error) {
      console.error("Erro ao carregar opções:", error);
      toast.error("Erro ao carregar opções da consulta");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return {
    types,
    status,
    paymentMethods,
    isLoading,
    refetchOptions: fetchOptions,
  };
};
