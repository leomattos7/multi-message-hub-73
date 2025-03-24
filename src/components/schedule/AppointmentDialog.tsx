
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { Appointment } from "@/hooks/use-appointments";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";

interface AppointmentDialogProps {
  date: Date;
  time: string | null;
  onClose: () => void;
  appointment?: Appointment;
}

const AppointmentDialog = ({ date, time, onClose, appointment }: AppointmentDialogProps) => {
  const [patientName, setPatientName] = useState("");
  const [status, setStatus] = useState("aguardando");
  const [type, setType] = useState("Consulta");
  const [paymentMethod, setPaymentMethod] = useState("insurance");
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState(time || "08:00");
  const [endTime, setEndTime] = useState("09:00");
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
            end_time: endTime
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
        const formattedDate = format(date, "yyyy-MM-dd");
        
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
        
        toast.success(`Consulta agendada para ${format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} das ${startTime} às ${endTime}`);
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

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{dialogTitle}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div>
          <p className="font-medium mb-1">Data:</p>
          <p>{format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
        </div>
        
        <div>
          <p className="font-medium mb-1">Horário da Consulta:</p>
          <TimeRangeSelector 
            startTime={startTime} 
            endTime={endTime} 
            onTimeChange={handleTimeChange}
          />
        </div>
        
        <div>
          <label htmlFor="patientName" className="font-medium mb-1 block">Nome do Paciente:</label>
          <Input 
            id="patientName"
            type="text" 
            value={patientName} 
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Digite o nome do paciente"
            disabled={!!appointment} // Disable editing patient name when updating
          />
        </div>
        <div>
          <label htmlFor="status" className="font-medium mb-1 block">Status:</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aguardando">Aguardando</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="type" className="font-medium mb-1 block">Tipo de Consulta:</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Consulta">Consulta de Rotina</SelectItem>
              <SelectItem value="Retorno">Retorno</SelectItem>
              <SelectItem value="Urgência">Urgência</SelectItem>
              <SelectItem value="Exame">Resultado de Exame</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="paymentMethod" className="font-medium mb-1 block">Forma de Pagamento:</label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a forma de pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="insurance">Plano de Saúde</SelectItem>
              <SelectItem value="private">Particular</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="notes" className="font-medium mb-1 block">Observações:</label>
          <Textarea 
            id="notes"
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações adicionais"
            className="resize-none min-h-[80px]"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Salvando..." : (appointment ? "Atualizar" : "Salvar")}
        </Button>
      </div>
    </DialogContent>
  );
};

export default AppointmentDialog;
