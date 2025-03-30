
import { Button } from "@/components/ui/button";
import { 
  FileEdit, 
  Mail, 
  MapPin, 
  Phone, 
  Trash2, 
  CreditCard, 
  Clipboard, 
  CalendarClock, 
  User,
  UserCircle
} from "lucide-react";
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
  
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Não definido";
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  const getBiologicalSexLabel = (sex?: string) => {
    switch (sex) {
      case 'male': return 'Masculino';
      case 'female': return 'Feminino';
      case 'intersex': return 'Intersexo';
      case 'not_informed': return 'Não Informado';
      default: return 'Não definido';
    }
  };

  const getGenderIdentityLabel = (gender?: string) => {
    switch (gender) {
      case 'man': return 'Homem';
      case 'woman': return 'Mulher';
      case 'non_binary': return 'Não-Binário';
      case 'other': return 'Outro';
      case 'not_informed': return 'Não Informado';
      default: return 'Não definido';
    }
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
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
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
          </div>
          
          <div className="space-y-3">
            {patient.cpf && (
              <div className="flex items-center text-sm">
                <Clipboard className="h-4 w-4 mr-2 text-gray-500" />
                <span>CPF: {patient.cpf}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm">
              <CalendarClock className="h-4 w-4 mr-2 text-gray-500" />
              <span>Data de Nascimento: {patient.birth_date ? formatDate(patient.birth_date) : "Não informado"}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span>Sexo Biológico: {getBiologicalSexLabel(patient.biological_sex)}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <UserCircle className="h-4 w-4 mr-2 text-gray-500" />
              <span>Identidade de Gênero: {getGenderIdentityLabel(patient.gender_identity)}</span>
            </div>
          </div>
        </div>
        
        {/* Notes Section */}
        {patient.notes && (
          <div className="pt-2 border-t">
            <div className="flex items-center text-sm font-medium mb-1">
              <Clipboard className="h-4 w-4 mr-2 text-gray-500" />
              Anotações
            </div>
            <p className="text-sm text-gray-700 pl-6">{patient.notes}</p>
          </div>
        )}
        
        {/* Last Message and Appointment */}
        <div className="pt-2 border-t">
          <p className="text-sm text-gray-500">Última Mensagem: {formatDate(patient.lastMessageDate)}</p>
          <p className="text-sm text-gray-500 mt-1">Última Consulta: {formatDate(patient.lastAppointmentDate)}</p>
        </div>
        
        {/* Create Appointment Button */}
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
