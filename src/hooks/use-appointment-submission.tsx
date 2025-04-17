import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiService } from "../services/api-service";
import { v4 as uuidv4 } from "uuid";

// Interface para o payload de envio (com id)
interface AppointmentData {
  id?: string;
  doctor_id: string;
  patient_id: string;
  date: string;
  time: string;
  end_time: string;
  type: string;
  status: string;
  notes: string | null;
  payment_method: string;
}

// Interface para a resposta da API (com id)
interface AppointmentResponse extends AppointmentData {
  id: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useAppointmentSubmission = () => {
  const queryClient = useQueryClient();

  const { mutate: submitAppointment, isPending: isLoading } = useMutation({
    mutationFn: async (data: AppointmentData): Promise<AppointmentData> => {
      console.log("Dados recebidos para envio:", data);

      // Se tiver ID, é uma atualização
      if (data.id) {
        const response = await apiService.put<ApiResponse<AppointmentData>>(
          `/api/appointments/${data.id}`,
          data
        );
        return response.data;
      }

      // Se não tiver ID, é uma criação
      const appointmentWithId = {
        ...data,
        id: uuidv4(),
      };

      const response = await apiService.post<ApiResponse<AppointmentData>>(
        "/api/appointments",
        appointmentWithId
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      const message = variables.id
        ? "Agendamento atualizado com sucesso!"
        : "Agendamento realizado com sucesso!";
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: ApiError) => {
      console.error("Erro ao processar agendamento:", error);
      toast.error(
        error.response?.data?.message || "Erro ao processar agendamento"
      );
    },
  });

  return {
    submitAppointment,
    isLoading,
  };
};
