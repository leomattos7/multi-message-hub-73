
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { appointmentService } from "@/integrations/supabase/services/appointmentService";
import { patientService } from "@/integrations/supabase/services/patientService";
import { useQueryClient } from "@tanstack/react-query";

interface AppointmentSubmissionProps {
  appointment?: any;
  patientName: string;
  status: string;
  type: string;
  paymentMethod: string;
  notes: string;
  startTime: string;
  endTime: string;
  selectedDate: Date;
  onClose: () => void;
}

export function useAppointmentSubmission() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const handleSubmit = async ({
    appointment,
    patientName,
    status,
    type,
    paymentMethod,
    notes,
    startTime,
    endTime,
    selectedDate,
    onClose
  }: AppointmentSubmissionProps) => {
    if (!patientName.trim()) {
      toast.error("Por favor, informe o nome do paciente");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if we're editing an existing appointment
      if (appointment) {
        // Update the appointment
        await appointmentService.updateAppointment(appointment.id, {
          status: status as 'aguardando' | 'confirmado' | 'cancelado',
          payment_method: paymentMethod as 'Particular' | 'Convênio',
          notes: notes,
          start_time: `${format(selectedDate, "yyyy-MM-dd")}T${startTime}:00`,
          end_time: `${format(selectedDate, "yyyy-MM-dd")}T${endTime}:00`
        });
        
        toast.success("Consulta atualizada com sucesso");
      } else {
        // Creating a new appointment - First, create a patient record if it doesn't exist
        const { data: patientData, error: patientError } = await patientService.getPatients();
        
        if (patientError) {
          toast.error("Erro ao verificar paciente");
          setIsLoading(false);
          return;
        }
        
        // Find existing patient or create new one
        let patientId;
        const existingPatient = patientData.find(p => p.full_name === patientName);
        
        if (!existingPatient) {
          // Create new patient
          const newPatient = await patientService.createPatient({ 
            full_name: patientName
          });
          
          patientId = newPatient.id;
        } else {
          patientId = existingPatient.id;
        }
        
        // Now create the appointment
        const formattedStartTime = `${format(selectedDate, "yyyy-MM-dd")}T${startTime}:00`;
        const formattedEndTime = `${format(selectedDate, "yyyy-MM-dd")}T${endTime}:00`;
        
        await appointmentService.createAppointment({
          patient_id: patientId,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
          status: status as 'aguardando' | 'confirmado' | 'cancelado',
          payment_method: paymentMethod as 'Particular' | 'Convênio',
          notes: notes
        });
        
        toast.success(`Consulta agendada com sucesso`);
      }
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      
      onClose();
    } catch (error) {
      console.error("Error creating/updating appointment:", error);
      toast.error("Erro ao processar consulta");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit
  };
}
