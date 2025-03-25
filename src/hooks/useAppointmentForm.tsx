
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Appointment } from "@/hooks/use-appointments";
import { useAppointmentSubmission } from "@/hooks/useAppointmentSubmission";

interface AppointmentFormState {
  patientName: string;
  status: string;
  type: string;
  paymentMethod: string;
  notes: string;
  startTime: string;
  endTime: string;
  selectedDate: Date;
}

interface UseAppointmentFormProps {
  initialDate: Date;
  initialTime: string | null;
  appointment?: Appointment;
  onClose: () => void;
}

export function useAppointmentForm({
  initialDate,
  initialTime,
  appointment,
  onClose
}: UseAppointmentFormProps) {
  // Form state
  const [formState, setFormState] = useState<AppointmentFormState>({
    patientName: "",
    status: "aguardando",
    type: "Consulta",
    paymentMethod: "insurance",
    notes: "",
    startTime: initialTime || "08:00",
    endTime: "09:00",
    selectedDate: initialDate,
  });
  
  const { isLoading, handleSubmit: submitAppointment } = useAppointmentSubmission();
  
  // Initialize form with appointment data if editing
  useEffect(() => {
    if (appointment) {
      setFormState({
        patientName: appointment.patient?.name || "",
        status: appointment.status,
        type: appointment.type,
        paymentMethod: appointment.payment_method || "insurance",
        notes: appointment.notes || "",
        startTime: appointment.time,
        endTime: appointment.end_time || calculateEndTime(appointment.time),
        selectedDate: appointment.date ? new Date(appointment.date) : initialDate,
      });
    }
  }, [appointment, initialDate]);

  // Calculate default end time (1 hour after start time)
  const calculateEndTime = (startTimeStr: string): string => {
    const [hours, minutes] = startTimeStr.split(':').map(Number);
    let endHours = hours + 1;
    if (endHours >= 24) endHours = 23;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  // Field update handlers
  const setField = <K extends keyof AppointmentFormState>(
    field: K,
    value: AppointmentFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };
  
  // Handle time range changes
  const handleTimeChange = (newStartTime: string, newEndTime: string) => {
    setFormState((prev) => ({
      ...prev,
      startTime: newStartTime,
      endTime: newEndTime
    }));
  };
  
  // Form validation
  const validateForm = (): boolean => {
    if (!formState.patientName.trim()) {
      toast.error("Por favor, informe o nome do paciente");
      return false;
    }
    return true;
  };
  
  // Form submission handler
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    submitAppointment({
      appointment,
      patientName: formState.patientName,
      status: formState.status,
      type: formState.type,
      paymentMethod: formState.paymentMethod,
      notes: formState.notes,
      startTime: formState.startTime,
      endTime: formState.endTime,
      selectedDate: formState.selectedDate,
      onClose
    });
  };

  return {
    formState,
    isLoading,
    isEditMode: !!appointment,
    setField,
    handleTimeChange,
    handleSubmit,
  };
}
