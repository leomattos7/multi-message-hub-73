import { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import { toast } from "sonner";
import { useAppointmentSubmission } from "./use-appointment-submission";
import { Appointment } from "@/types/appointment";

interface FormState {
  id?: string;
  doctorId: string | null;
  patientId: string | null;
  date: Date | null;
  startTime: string;
  endTime: string;
  type: string | null;
  status: string | null;
  notes: string;
  paymentMethod: string | null;
}

export const useAppointmentForm = (
  onSuccess?: () => void,
  existingAppointment?: Appointment
) => {
  const { submitAppointment, isLoading } = useAppointmentSubmission();
  const [formState, setFormState] = useState<FormState>({
    id: existingAppointment?.id,
    doctorId: existingAppointment?.doctor_id || null,
    patientId: existingAppointment?.patient_id || null,
    date: existingAppointment?.date
      ? parse(existingAppointment.date, "yyyy-MM-dd", new Date())
      : null,
    startTime: existingAppointment?.time
      ? existingAppointment.time.substring(0, 5)
      : "",
    endTime: existingAppointment?.end_time
      ? existingAppointment.end_time.substring(0, 5)
      : "",
    type: existingAppointment?.type || null,
    status: existingAppointment?.status || null,
    notes: existingAppointment?.notes || "",
    paymentMethod: existingAppointment?.payment_method || null,
  });

  // Atualiza o estado do formulário quando o agendamento existente mudar
  useEffect(() => {
    if (existingAppointment) {
      setFormState({
        id: existingAppointment.id,
        doctorId: existingAppointment.doctor_id,
        patientId: existingAppointment.patient_id,
        date: parse(existingAppointment.date, "yyyy-MM-dd", new Date()),
        startTime: existingAppointment.time.substring(0, 5),
        endTime: existingAppointment.end_time.substring(0, 5),
        type: existingAppointment.type,
        status: existingAppointment.status,
        notes: existingAppointment.notes || "",
        paymentMethod: existingAppointment.payment_method,
      });
    }
  }, [existingAppointment]);

  const handleSubmit = async () => {
    try {
      // Validações
      if (!formState.doctorId) {
        toast.error("Por favor, selecione um médico");
        return;
      }

      if (!formState.patientId) {
        toast.error("Por favor, selecione um paciente");
        return;
      }

      if (!formState.date) {
        toast.error("Por favor, selecione uma data");
        return;
      }

      if (!formState.startTime) {
        toast.error("Por favor, selecione um horário de início");
        return;
      }

      if (!formState.endTime) {
        toast.error("Por favor, selecione um horário de término");
        return;
      }

      if (!formState.type) {
        toast.error("Por favor, selecione o tipo de consulta");
        return;
      }

      if (!formState.status) {
        toast.error("Por favor, selecione o status");
        return;
      }

      if (!formState.paymentMethod) {
        toast.error("Por favor, selecione a forma de pagamento");
        return;
      }

      // Preparar os dados para envio
      const appointmentData = {
        id: formState.id,
        doctor_id: formState.doctorId,
        patient_id: formState.patientId,
        date: format(formState.date, "yyyy-MM-dd"),
        time: formState.startTime + ":00",
        end_time: formState.endTime + ":00",
        type: formState.type,
        status: formState.status,
        notes: formState.notes.trim() || null,
        payment_method: formState.paymentMethod,
      };

      console.log("Dados do agendamento preparados:", appointmentData);

      // Enviar os dados
      await submitAppointment(appointmentData);

      // Limpar o formulário
      setFormState({
        id: undefined,
        doctorId: null,
        patientId: null,
        date: null,
        startTime: "",
        endTime: "",
        type: null,
        status: null,
        notes: "",
        paymentMethod: null,
      });

      // Chamar o callback de sucesso se existir
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
      toast.error("Erro ao processar formulário. Por favor, tente novamente.");
    }
  };

  return {
    formState,
    setFormState,
    handleSubmit,
    isLoading,
  };
};
