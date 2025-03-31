
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PatientInfoFieldsProps {
  patientName: string;
  setPatientName: (value: string) => void;
  status?: string;
  setStatus?: (value: string) => void;
  type?: string;
  setType?: (value: string) => void;
  paymentMethod?: string;
  setPaymentMethod?: (value: string) => void;
  isEditMode: boolean;
  renderPatientField?: boolean;
  renderStatusTypePayment?: boolean;
}

const PatientInfoFields = ({
  patientName,
  setPatientName,
  status,
  setStatus,
  type,
  setType,
  paymentMethod,
  setPaymentMethod,
  isEditMode,
  renderPatientField = true,
  renderStatusTypePayment = false,
}: PatientInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      {renderPatientField && (
        <div>
          <Input 
            id="patientName"
            type="text" 
            value={patientName} 
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Digite o nome do paciente"
            disabled={isEditMode} // Disable editing patient name when updating
          />
        </div>
      )}

      {renderStatusTypePayment && (
        <>
          {status && setStatus && (
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aguardando">Aguardando</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {type && setType && (
            <div>
              <Label htmlFor="type">Tipo de Consulta</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
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
          )}

          {paymentMethod && setPaymentMethod && (
            <div>
              <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="insurance">Plano de Saúde</SelectItem>
                  <SelectItem value="private">Particular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientInfoFields;
