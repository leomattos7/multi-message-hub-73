
import React from "react";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/utils/records-utils";
import { Patient } from "@/types/patient";

interface PatientInfoProps {
  patient: Patient;
  onNewRecord: () => void;
  onEditPatient?: () => void;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ 
  patient, 
  onNewRecord,
  onEditPatient 
}) => {
  // Get either full_name or name
  const displayName = patient.full_name || patient.name;
  
  // Get birth_date from either field
  const birthDate = patient.date_of_birth || patient.birth_date;
  
  // Get payment method from either field
  const paymentMethod = patient.payment_form || patient.payment_method;
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{displayName}</h2>
            <p className="text-gray-500">{patient.email}</p>
          </div>
          
          <div className="flex space-x-2">
            {onEditPatient && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onEditPatient}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Paciente
              </Button>
            )}
            
            <Button 
              size="sm"
              onClick={onNewRecord}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Registro
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Telefone</p>
            <p>{patient.phone || "Não informado"}</p>
          </div>
          
          <div>
            <p className="text-gray-500">Data de Nascimento</p>
            <p>{birthDate ? formatDate(birthDate) : "Não informado"}</p>
          </div>
          
          <div>
            <p className="text-gray-500">Método de Pagamento</p>
            <p>{paymentMethod || "Não informado"}</p>
          </div>
          
          <div>
            <p className="text-gray-500">Sexo Biológico</p>
            <p>{patient.biological_sex || "Não informado"}</p>
          </div>
          
          <div>
            <p className="text-gray-500">Identidade de Gênero</p>
            <p>{patient.gender_identity || "Não informado"}</p>
          </div>
          
          <div>
            <p className="text-gray-500">CPF</p>
            <p>{patient.cpf || "Não informado"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
