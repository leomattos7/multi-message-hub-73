
import { Button } from "@/components/ui/button";
import { FileEdit, Mail, MapPin, Phone, Trash2, CreditCard, Clipboard, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Patient } from "@/types/patient";

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  isDoctor: boolean;
}

export const PatientDetail = ({
  patient,
  onBack,
  onEdit,
  onDelete,
  isDoctor
}: PatientDetailProps) => {
  
  const formatDate = (date: Date | null) => {
    if (!date) return "Não definido";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">{patient.name}</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
          >
            <FileEdit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          {isDoctor && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
          >
            Voltar
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center text-sm">
          <Mail className="h-4 w-4 mr-2 text-gray-500" />
          {patient.email || "Não informado"}
        </div>
        <div className="flex items-center text-sm">
          <Phone className="h-4 w-4 mr-2 text-gray-500" />
          {patient.phone || "Não informado"}
        </div>
        
        {patient.address && (
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            {patient.address}
          </div>
        )}
        
        <div className="flex items-center text-sm">
          <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
          {patient.payment_method === "convenio" 
            ? `Convênio: ${patient.insurance_name || "Não especificado"}` 
            : "Particular"}
        </div>
        
        {patient.notes && (
          <div className="pt-2 border-t">
            <div className="flex items-center text-sm font-medium mb-1">
              <Clipboard className="h-4 w-4 mr-2 text-gray-500" />
              Anotações
            </div>
            <p className="text-sm text-gray-700 pl-6">{patient.notes}</p>
          </div>
        )}
        
        <div className="pt-2 border-t">
          <p className="text-sm text-gray-500">Última Mensagem: {formatDate(patient.lastMessageDate)}</p>
          <p className="text-sm text-gray-500 mt-1">Última Consulta: {formatDate(patient.lastAppointmentDate)}</p>
        </div>
        
        <div className="pt-4">
          <Button variant="outline" size="sm" asChild className="w-full justify-center">
            <a href="/agendamentos">
              <CalendarClock className="h-4 w-4 mr-2" />
              Ver/Criar Agendamento
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
