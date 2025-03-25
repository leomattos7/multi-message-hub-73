
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
        const { error: appointmentError } = await supabase
          .from("appointments")
          .update({
            type: type,
            status: status,
            payment_method: paymentMethod,
            notes: notes,
            time: startTime,
            end_time: endTime,
            date: format(selectedDate, "yyyy-MM-dd")
          })
          .eq('id', appointment.id);
          
        if (appointmentError) {
          toast.error("Erro ao atualizar consulta");
          setIsLoading(false);
          return;
        }
        
        toast.success("Consulta atualizada com sucesso");
      } else {
        // Creating a new appointment - First, create a patient record if it doesn't exist
        const { data: patientData, error: patientError } = await supabase
          .from("patients")
          .select("id")
          .eq("name", patientName)
          .maybeSingle();
          
        let patientId;
        
        if (patientError) {
          toast.error("Erro ao verificar paciente");
          setIsLoading(false);
          return;
        }
        
        // If patient doesn't exist, create one
        if (!patientData) {
          const { data: newPatient, error: createError } = await supabase
            .from("patients")
            .insert({ name: patientName })
            .select("id")
            .single();
            
          if (createError) {
            toast.error("Erro ao criar paciente");
            setIsLoading(false);
            return;
          }
          
          patientId = newPatient.id;
        } else {
          patientId = patientData.id;
        }
        
        // Now create the appointment
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        
        const { error: appointmentError } = await supabase
          .from("appointments")
          .insert({
            patient_id: patientId,
            date: formattedDate,
            time: startTime,
            end_time: endTime,
            type: type,
            status: status,
            payment_method: paymentMethod,
            notes: notes
          });
          
        if (appointmentError) {
          toast.error("Erro ao agendar consulta");
          setIsLoading(false);
          return;
        }
        
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
