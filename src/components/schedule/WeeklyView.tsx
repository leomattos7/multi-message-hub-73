
import React, { useState } from "react";
import { format, addDays, startOfWeek, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface WeeklyViewProps {
  date: Date;
}

const WeeklyView = ({ date }: WeeklyViewProps) => {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  const startDate = startOfWeek(date, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // Time slots from 8:00 to 18:00 (hourly intervals)
  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    timeSlots.push(`${hour}:00`);
  }

  const handleCellClick = (day: Date, time: string) => {
    setSelectedDay(day);
    setSelectedTime(time);
    setIsNewAppointmentOpen(true);
  };

  const handleCreateAppointment = () => {
    if (selectedDay && selectedTime) {
      const formattedDate = format(selectedDay, "dd/MM/yyyy", { locale: ptBR });
      toast.success(`Agendamento criado para ${formattedDate} às ${selectedTime}`);
      setIsNewAppointmentOpen(false);
    }
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Semana atual</h3>
        <Button onClick={() => setIsNewAppointmentOpen(true)} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>
      
      <div className="grid grid-cols-8 min-w-[800px]">
        {/* Time column */}
        <div className="col-span-1">
          <div className="h-12"></div> {/* Empty header cell */}
          {timeSlots.map((time) => (
            <div key={time} className="h-24 border-b border-r px-2 py-1 flex items-center">
              {time}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day) => (
          <div key={day.toString()} className="col-span-1">
            <div 
              className={cn(
                "h-12 border-b border-r px-2 py-1 text-center font-semibold",
                isToday(day) ? "bg-blue-100" : ""
              )}
            >
              <div>{format(day, "EEE", { locale: ptBR })}</div>
              <div>{format(day, "dd", { locale: ptBR })}</div>
            </div>
            {timeSlots.map((time) => (
              <div 
                key={`${day}-${time}`} 
                className="h-24 border-b border-r hover:bg-blue-50 cursor-pointer"
                onClick={() => handleCellClick(day, time)}
              ></div>
            ))}
          </div>
        ))}
      </div>

      {/* Dialog for new appointment */}
      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <p className="font-medium mb-1">Data:</p>
              <p>{selectedDay ? format(selectedDay, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Selecione uma data'}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Horário:</p>
              <p>{selectedTime || 'Selecione um horário'}</p>
            </div>
            <div>
              <label htmlFor="patientName" className="font-medium mb-1 block">Nome do Paciente:</label>
              <input 
                id="patientName"
                type="text" 
                className="w-full p-2 border rounded"
                placeholder="Digite o nome do paciente"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateAppointment}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyView;
