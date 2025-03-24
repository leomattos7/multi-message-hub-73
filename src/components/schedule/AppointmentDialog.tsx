
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface AppointmentDialogProps {
  date: Date;
  time: string | null;
  onClose: () => void;
}

const AppointmentDialog = ({ date, time, onClose }: AppointmentDialogProps) => {
  const [patientName, setPatientName] = useState("");
  
  const handleSubmit = () => {
    if (!patientName.trim()) {
      toast.error("Por favor, informe o nome do paciente");
      return;
    }
    
    toast.success(`Consulta agendada para ${format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às ${time}`);
    onClose();
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
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Salvar</Button>
      </div>
    </DialogContent>
  );
};

export default AppointmentDialog;
