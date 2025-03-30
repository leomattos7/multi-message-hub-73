
import React from "react";
import { Input } from "@/components/ui/input";

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
  isEditMode,
  renderPatientField = true,
}: Pick<PatientInfoFieldsProps, 'patientName' | 'setPatientName' | 'isEditMode' | 'renderPatientField'>) => {
  return (
    <div className="space-y-4">
      {renderPatientField && (
        <Input 
          id="patientName"
          type="text" 
          value={patientName} 
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Digite o nome do paciente"
          disabled={isEditMode} // Disable editing patient name when updating
        />
      )}
    </div>
  );
};

export default PatientInfoFields;
