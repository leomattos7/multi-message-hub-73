
import { useState } from "react";
import { toast } from "sonner";
import { Appointment } from "@/hooks/use-appointments";
import { appointmentService } from "@/integrations/supabase/services/appointmentService";
import { useQueryClient } from "@tanstack/react-query";
import { patientService } from "@/integrations/supabase/services/patientService"; 

interface AppointmentFormData {
  selectedDate: Date;
  patientId: string;
  patientName: string;
  startTime: string;
  endTime: string;
  status: "aguardando" | "confirmado" | "cancelado";
  paymentMethod?: "Particular" | "Convênio";
  notes: string;
  type: string;
}

interface UseAppointmentFormProps {
  initialDate: Date;
  initialTime: string | null;
  appointment?: Appointment;
  onClose: () => void;
}

export const useAppointmentForm = ({
  initialDate,
  initialTime,
  appointment,
  onClose
}: UseAppointmentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!appointment;
  const queryClient = useQueryClient();

  // Set initial form state based on appointment data or defaults
  const [formState, setFormState] = useState<AppointmentFormData>({
    selectedDate: isEditMode ? new Date(appointment.date) : initialDate,
    patientId: isEditMode ? appointment.patient_id : "",
    patientName: isEditMode ? (appointment.patient?.full_name || "") : "",
    startTime: isEditMode ? appointment.time : (initialTime || "08:00"),
    endTime: isEditMode ? (appointment.end_time || "") : "",
    status: isEditMode ? appointment.status : "aguardando",
    paymentMethod: isEditMode ? appointment.payment_method : undefined,
    notes: isEditMode ? (appointment.notes || "") : "",
    type: isEditMode ? (appointment.consultation_type_id || "") : "",
  });

  // Helper to set a specific field value
  const setField = (field: keyof AppointmentFormData, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  // Handle time range selection
  const handleTimeChange = (startTime: string, endTime: string) => {
    setFormState(prev => ({
      ...prev,
      startTime,
      endTime
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validate form data
      if (!formState.patientName.trim()) {
        toast.error("O nome do paciente é obrigatório");
        setIsLoading(false);
        return;
      }

      if (!formState.startTime) {
        toast.error("O horário de início é obrigatório");
        setIsLoading(false);
        return;
      }

      // Check if patient exists or create a new one
      let patientId = formState.patientId;
      if (!patientId) {
        const newPatient = await patientService.createPatient({
          full_name: formState.patientName,
        });
        patientId = newPatient.id;
      }

      const date = formState.selectedDate.toISOString().split('T')[0];

      if (isEditMode && appointment) {
        // Update existing appointment
        await appointmentService.updateAppointment(appointment.id, {
          date,
          time: formState.startTime,
          start_time: formState.startTime, // Add start_time field
          end_time: formState.endTime,
          patient_id: patientId,
          doctor_id: appointment.doctor_id,
          status: formState.status,
          payment_method: formState.paymentMethod,
          notes: formState.notes,
          consultation_type_id: formState.type,
        });

        toast.success("Consulta atualizada com sucesso");
      } else {
        // Create new appointment
        await appointmentService.createAppointment({
          date,
          time: formState.startTime,
          start_time: formState.startTime, // Add start_time field
          end_time: formState.endTime,
          patient_id: patientId,
          doctor_id: "current-doctor-id", // This should come from authentication context
          status: formState.status,
          payment_method: formState.paymentMethod,
          notes: formState.notes,
          consultation_type_id: formState.type,
        });

        toast.success("Consulta agendada com sucesso");
      }

      // Invalidate queries to refetch appointments
      queryClient.invalidateQueries({ queryKey: ["appointments"] });

      // Close dialog
      onClose();
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast.error("Erro ao salvar consulta");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formState,
    isLoading,
    isEditMode,
    setField,
    handleTimeChange,
    handleSubmit
  };
};
