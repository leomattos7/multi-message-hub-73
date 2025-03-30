
import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Appointment } from "@/hooks/use-appointments";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { useAppointmentForm } from "@/hooks/useAppointmentForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <DialogContent className="sm:max-w-[650px]">
      <DialogHeader>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para agendar uma consulta
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="patientName" className="font-medium mb-1 block">Nome do Paciente:</label>
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
                renderPatientField={true}
                renderStatusTypePayment={false}
              />
            </div>
            
            <DatePickerField 
              selectedDate={formState.selectedDate}
              onChange={(date) => date && setField("selectedDate", date)}
              label="Data da Consulta"
            />
            
            <div>
              <p className="font-medium mb-1">Horário da Consulta:</p>
              <TimeRangeSelector 
                startTime={formState.startTime} 
                endTime={formState.endTime} 
                onTimeChange={handleTimeChange}
              />
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="type" className="font-medium mb-1 block">Tipo de Consulta:</label>
              <Select value={formState.type} onValueChange={(value) => setField("type", value)}>
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
              <label htmlFor="status" className="font-medium mb-1 block">Status:</label>
              <Select value={formState.status} onValueChange={(value) => setField("status", value)}>
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
              <label htmlFor="paymentMethod" className="font-medium mb-1 block">Forma de Pagamento:</label>
              <Select value={formState.paymentMethod} onValueChange={(value) => setField("paymentMethod", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="insurance">Plano de Saúde</SelectItem>
                  <SelectItem value="private">Particular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <NotesField
              notes={formState.notes}
              setNotes={(value) => setField("notes", value)}
            />
          </div>
        </div>
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
