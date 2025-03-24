
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AppointmentDialog from "./AppointmentDialog";
import { useAppointments } from "@/hooks/use-appointments";
import AppointmentIndicator from "./AppointmentIndicator";

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
  const { appointments, isLoading } = useAppointments(date);

  const handleSlotClick = (time: string) => {
    setSelectedSlot(time);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSlot(null);
  };

  // Group appointments by time
  const appointmentsByTime = appointments.reduce((acc, appointment) => {
    const time = appointment.time.substring(0, 5); // Get just the hour:minute part
    if (!acc[time]) {
      acc[time] = [];
    }
    acc[time].push(appointment);
    return acc;
  }, {} as Record<string, typeof appointments>);

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
        {timeSlots.map((time) => {
          const slotAppointments = appointmentsByTime[time] || [];
          return (
            <div 
              key={time} 
              className="border-b p-3 hover:bg-blue-50 cursor-pointer"
              onClick={() => handleSlotClick(time)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{time}</span>
                <Button size="sm" variant="ghost">
                  <Plus className="h-4 w-4 mr-1" />
                  Agendar
                </Button>
              </div>
              
              {slotAppointments.length > 0 ? (
                <div className="mt-2 space-y-1">
                  {slotAppointments.map((appointment) => (
                    <AppointmentIndicator 
                      key={appointment.id} 
                      appointment={appointment}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-sm mt-1">Nenhuma consulta agendada</div>
              )}
            </div>
          );
        })}
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
