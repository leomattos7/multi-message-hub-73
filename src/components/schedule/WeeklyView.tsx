
import React, { useState, useMemo } from "react";
import { addDays, startOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useAppointments, Appointment } from "@/hooks/use-appointments";
import AppointmentDialog from "./AppointmentDialog";
import { generateTimeSlots } from "@/utils/timeSlotUtils";
import TimeColumn from "./TimeColumn";
import DayColumn from "./DayColumn";
import DeleteAppointmentDialog from "./DeleteAppointmentDialog";
import { useAppointmentDeletion } from "@/hooks/useAppointmentDeletion";

interface WeeklyViewProps {
  date: Date;
  onDateSelect?: (date: Date) => void;
}

const WeeklyView = ({ date, onDateSelect }: WeeklyViewProps) => {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  const startDate = startOfWeek(date, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // Get all appointments for the week
  const { appointments, isLoading: isLoadingAppointments } = useAppointments();
  
  // Use the appointment deletion hook
  const {
    isLoading: isDeletingAppointment,
    deleteDialogOpen,
    handleDeleteClick,
    confirmDelete,
    setDeleteDialogOpen
  } = useAppointmentDeletion();
  
  // Use useMemo to generate time slots based on appointments
  const timeSlots = useMemo(() => {
    return generateTimeSlots(appointments);
  }, [appointments]);

  // Group appointments by date and time
  const appointmentsByDateAndTime = appointments.reduce((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = {};
    }
    
    const time = appointment.time.substring(0, 5); // Get just the hour:minute part
    if (!acc[appointment.date][time]) {
      acc[appointment.date][time] = [];
    }
    
    acc[appointment.date][time].push(appointment);
    return acc;
  }, {} as Record<string, Record<string, typeof appointments>>);

  const handleCellClick = (day: Date, time: string) => {
    setSelectedDay(day);
    setSelectedTime(time);
    setSelectedAppointment(null);
    setIsNewAppointmentOpen(true);
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  const handleCloseDialog = () => {
    setIsNewAppointmentOpen(false);
    setSelectedAppointment(null);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    // Find the date for this appointment
    const appointmentDate = new Date(appointment.date);
    setSelectedDay(appointmentDate);
    setSelectedAppointment(appointment);
    setSelectedTime(null);
    setIsNewAppointmentOpen(true);
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Semana atual</h3>
        <Button 
          onClick={() => {
            setSelectedDay(new Date());
            setSelectedTime("08:00");
            setSelectedAppointment(null);
            setIsNewAppointmentOpen(true);
          }} 
          size="sm"
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="mr-1 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>
      
      <div className="grid grid-cols-8 min-w-[800px] rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
        {/* Time column */}
        <TimeColumn timeSlots={timeSlots} />

        {/* Day columns */}
        {weekDays.map((day) => (
          <DayColumn
            key={day.toString()}
            day={day}
            timeSlots={timeSlots}
            appointmentsByDateAndTime={appointmentsByDateAndTime}
            isLoadingAppointments={isLoadingAppointments}
            onCellClick={handleCellClick}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteClick}
          />
        ))}
      </div>

      {/* Dialog for new appointment */}
      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        {selectedDay && (
          <AppointmentDialog 
            date={selectedDay} 
            time={selectedTime} 
            onClose={handleCloseDialog}
            appointment={selectedAppointment || undefined}
          />
        )}
      </Dialog>

      {/* Delete appointment dialog */}
      <DeleteAppointmentDialog
        isOpen={deleteDialogOpen}
        isLoading={isDeletingAppointment}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default WeeklyView;
