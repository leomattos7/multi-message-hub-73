
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Appointment } from "@/hooks/use-appointments";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import DatePickerField from "./DatePickerField";
import PatientInfoFields from "./PatientInfoFields";
import NotesField from "./NotesField";
import DialogActionButtons from "./DialogActionButtons";

interface AppointmentDialogProps {
  date: Date;
  time: string | null;
  onClose: () => void;
  appointment?: Appointment;
}

const AppointmentDialog = ({ date: initialDate, time, onClose, appointment }: AppointmentDialogProps) => {
  const [patientName, setPatientName] = useState("");
  const [status, setStatus] = useState("aguardando");
  const [type, setType] = useState("Consulta");
  const [paymentMethod, setPaymentMethod] = useState("insurance");
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState(time || "08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  // Initialize form with appointment data if editing
  useEffect(() => {
    if (appointment) {
      setPatientName(appointment.patient?.name || "");
      setStatus(appointment.status);
      setType(appointment.type);
      setPaymentMethod(appointment.payment_method || "insurance");
      setNotes(appointment.notes || "");
      setStartTime(appointment.time);
      setEndTime(appointment.end_time || calculateEndTime(appointment.time));
      if (appointment.date) {
        setSelectedDate(new Date(appointment.date));
      }
    }
  }, [appointment]);

  // Calculate default end time (1 hour after start time)
  const calculateEndTime = (startTimeStr: string): string => {
    const [hours, minutes] = startTimeStr.split(':').map(Number);
    let endHours = hours + 1;
    if (endHours >= 24) endHours = 23;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  // Handle time range changes
  const handleTimeChange = (newStartTime: string, newEndTime: string) => {
    setStartTime(newStartTime);
    setEndTime(newEndTime);
  };
  
  const handleSubmit = async () => {
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
        
        toast.success(`Consulta agendada para ${format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} das ${startTime} às ${endTime}`);
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

  const dialogTitle = appointment ? "Editar Consulta" : "Agendar Consulta";
  const isEditMode = !!appointment;

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{dialogTitle}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <DatePickerField 
          selectedDate={selectedDate}
          onChange={(date) => date && setSelectedDate(date)}
          label="Data"
        />
        
        <div>
          <p className="font-medium mb-1">Horário da Consulta:</p>
          <TimeRangeSelector 
            startTime={startTime} 
            endTime={endTime} 
            onTimeChange={handleTimeChange}
          />
        </div>
        
        <PatientInfoFields
          patientName={patientName}
          setPatientName={setPatientName}
          status={status}
          setStatus={setStatus}
          type={type}
          setType={setType}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          isEditMode={isEditMode}
        />
        
        <NotesField
          notes={notes}
          setNotes={setNotes}
        />
      </div>
      
      <DialogActionButtons
        onClose={onClose}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isEditMode={isEditMode}
      />
    </DialogContent>
  );
};

export default AppointmentDialog;
