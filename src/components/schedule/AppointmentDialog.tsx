
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Appointment } from "@/hooks/use-appointments";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { useAppointmentSubmission } from "@/hooks/useAppointmentSubmission";
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
  
  const { isLoading, handleSubmit } = useAppointmentSubmission();
  
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
  
  const handleAppointmentSubmit = () => {
    handleSubmit({
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
    });
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
        onSubmit={handleAppointmentSubmit}
        isLoading={isLoading}
        isEditMode={isEditMode}
      />
    </DialogContent>
  );
};

export default AppointmentDialog;
