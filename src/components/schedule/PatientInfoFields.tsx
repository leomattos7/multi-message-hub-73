
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PatientInfoFieldsProps {
  patientName: string;
  setPatientName: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
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
  renderStatusTypePayment = true
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
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aguardando">Aguardando</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          
          <div>
            <label htmlFor="type" className="font-medium mb-1 block">Tipo de Consulta:</label>
            <Select value={type} onValueChange={setType}>
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
            <label htmlFor="paymentMethod" className="font-medium mb-1 block">Forma de Pagamento:</label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="insurance">Plano de Saúde</SelectItem>
                <SelectItem value="private">Particular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientInfoFields;
