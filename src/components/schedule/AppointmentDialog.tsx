import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { useAppointmentForm } from "@/hooks/use-appointment-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import DatePickerField from "./DatePickerField";
import NotesField from "./NotesField";
import DialogActionButtons from "./DialogActionButtons";
import { useDoctorList } from "@/hooks/use-doctor-list";
import { usePatientsByDoctor } from "@/hooks/use-patients-by-doctor";
import { useConsultationOptions } from "@/hooks/use-consultation-options";
import { Appointment } from "@/types/appointment";

interface AppointmentDialogProps {
  onClose: () => void;
  appointment?: Appointment;
}

const AppointmentDialog = ({
  onClose,
  appointment,
}: AppointmentDialogProps) => {
  const { formState, setFormState, handleSubmit, isLoading } =
    useAppointmentForm(onClose, appointment);

  const { doctors, isLoading: isDoctorsLoading } = useDoctorList();
  const { patients, isLoading: isPatientsLoading } = usePatientsByDoctor(
    formState.doctorId
  );
  const {
    types,
    status: statusOptions,
    paymentMethods,
    isLoading: isOptionsLoading,
  } = useConsultationOptions();

  return (
    <DialogContent className="sm:max-w-[650px]">
      <DialogHeader>
        <DialogTitle>
          {appointment ? "Editar Consulta" : "Agendar Consulta"}
        </DialogTitle>
        <DialogDescription>
          {appointment
            ? "Edite os campos abaixo para atualizar a consulta"
            : "Preencha os campos abaixo para agendar uma consulta"}
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="doctor" className="font-medium mb-1 block">
                Nome do Médico:
              </Label>
              {isDoctorsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={formState.doctorId || ""}
                  onValueChange={(value) => {
                    setFormState((prev) => ({
                      ...prev,
                      doctorId: value,
                      patientId: null, // Reset patient when doctor changes
                    }));
                  }}
                >
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder="Selecione o médico" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label htmlFor="patient" className="font-medium mb-1 block">
                Nome do Paciente:
              </Label>
              {isPatientsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={formState.patientId || ""}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      patientId: value,
                    }))
                  }
                  disabled={!formState.doctorId}
                >
                  <SelectTrigger id="patient">
                    <SelectValue
                      placeholder={
                        formState.doctorId
                          ? "Selecione o paciente"
                          : "Selecione um médico primeiro"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <DatePickerField
              selectedDate={formState.date}
              onChange={(date) =>
                setFormState((prev) => ({
                  ...prev,
                  date,
                }))
              }
              label="Data da Consulta"
            />

            <div>
              <p className="font-medium mb-1">Horário da Consulta:</p>
              <TimeRangeSelector
                startTime={formState.startTime}
                endTime={formState.endTime}
                onTimeChange={(startTime, endTime) =>
                  setFormState((prev) => ({
                    ...prev,
                    startTime,
                    endTime,
                  }))
                }
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="type" className="font-medium mb-1 block">
                Tipo de Consulta:
              </label>
              {isOptionsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={formState.type || ""}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      type: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <label htmlFor="status" className="font-medium mb-1 block">
                Status:
              </label>
              {isOptionsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={formState.status || ""}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      status: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <label htmlFor="paymentMethod" className="font-medium mb-1 block">
                Forma de Pagamento:
              </label>
              {isOptionsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={formState.paymentMethod || ""}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      paymentMethod: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <NotesField
              notes={formState.notes}
              setNotes={(value) =>
                setFormState((prev) => ({
                  ...prev,
                  notes: value,
                }))
              }
            />
          </div>
        </div>
      </div>

      <DialogActionButtons
        onClose={onClose}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isEditMode={!!appointment}
      />
    </DialogContent>
  );
};

export default AppointmentDialog;
