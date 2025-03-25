
import React from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Appointment } from "@/hooks/use-appointments";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { useAppointmentForm } from "@/hooks/useAppointmentForm";
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

const AppointmentDialog = ({ date, time, onClose, appointment }: AppointmentDialogProps) => {
  const {
    formState,
    isLoading,
    isEditMode,
    setField,
    handleTimeChange,
    handleSubmit
  } = useAppointmentForm({
    initialDate: date,
    initialTime: time,
    appointment,
    onClose
  });

  const dialogTitle = isEditMode ? "Editar Consulta" : "Agendar Consulta";

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{dialogTitle}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <DatePickerField 
          selectedDate={formState.selectedDate}
          onChange={(date) => date && setField("selectedDate", date)}
          label="Data"
        />
        
        <div>
          <p className="font-medium mb-1">Horário da Consulta:</p>
          <TimeRangeSelector 
            startTime={formState.startTime} 
            endTime={formState.endTime} 
            onTimeChange={handleTimeChange}
          />
        </div>
        
        <PatientInfoFields
          patientName={formState.patientName}
          setPatientName={(value) => setField("patientName", value)}
          status={formState.status}
          setStatus={(value) => setField("status", value)}
          type={formState.type}
          setType={(value) => setField("type", value)}
          paymentMethod={formState.paymentMethod}
          setPaymentMethod={(value) => setField("paymentMethod", value)}
          isEditMode={isEditMode}
        />
        
        <NotesField
          notes={formState.notes}
          setNotes={(value) => setField("notes", value)}
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
