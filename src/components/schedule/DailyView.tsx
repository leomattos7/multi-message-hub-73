
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AppointmentDialog from "./AppointmentDialog";

// Helper function to generate time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 18; hour++) {
    slots.push(`${hour}:00`);
  }
  return slots;
};

interface DailyViewProps {
  date: Date;
}

const DailyView = ({ date }: DailyViewProps) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const timeSlots = generateTimeSlots();

  const handleSlotClick = (time: string) => {
    setSelectedSlot(time);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </h3>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow">
        {timeSlots.map((time) => (
          <div 
            key={time} 
            className="border-b p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
            onClick={() => handleSlotClick(time)}
          >
            <span>{time}</span>
            <Button size="sm" variant="ghost">
              <Plus className="h-4 w-4 mr-1" />
              Agendar
            </Button>
          </div>
        ))}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedSlot && (
          <AppointmentDialog 
            date={date} 
            time={selectedSlot} 
            onClose={handleCloseDialog} 
          />
        )}
      </Dialog>
    </div>
  );
};

export default DailyView;
