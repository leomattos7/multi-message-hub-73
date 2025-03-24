
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";

interface AppointmentDialogProps {
  date: Date;
  time: string | null;
  onClose: () => void;
}

const AppointmentDialog = ({ date, time, onClose }: AppointmentDialogProps) => {
  const [patientName, setPatientName] = useState("");
  const [status, setStatus] = useState("aguardando");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const handleSubmit = async () => {
    if (!patientName.trim()) {
      toast.error("Por favor, informe o nome do paciente");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, create a patient record if it doesn't exist
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
          time: time || "08:00",
          type: "Consulta",
          status: status
        });
        
      if (appointmentError) {
        toast.error("Erro ao agendar consulta");
        setIsLoading(false);
        return;
      }
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      
      toast.success(`Consulta agendada para ${format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às ${time}`);
      onClose();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Erro ao agendar consulta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Agendar Consulta</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div>
          <p className="font-medium mb-1">Data:</p>
          <p>{format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
        </div>
        <div>
          <p className="font-medium mb-1">Horário:</p>
          <p>{time}</p>
        </div>
        <div>
          <label htmlFor="patientName" className="font-medium mb-1 block">Nome do Paciente:</label>
          <Input 
            id="patientName"
            type="text" 
            value={patientName} 
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Digite o nome do paciente"
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
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </DialogContent>
  );
};

export default AppointmentDialog;
