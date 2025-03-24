
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileEdit, Mail, Phone, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Patient } from "@/types/patient";

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onEditClick: (patient: Patient, e: React.MouseEvent) => void;
  onDeleteClick: (patient: Patient, e: React.MouseEvent) => void;
  isDoctor: boolean;
}

export const PatientList = ({ 
  patients,
  onSelectPatient,
  onEditClick,
  onDeleteClick,
  isDoctor
}: PatientListProps) => {
  
  const formatDate = (date: Date | null) => {
    if (!date) return "Não definido";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <Table>
      <TableCaption>Lista de contatos cadastrados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Última Mensagem</TableHead>
          <TableHead>Última Consulta</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-10">
              <p className="text-muted-foreground">Nenhum contato encontrado</p>
            </TableCell>
          </TableRow>
        ) : (
          patients.map(patient => (
            <TableRow key={patient.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onSelectPatient(patient)}>
              <TableCell className="font-medium">
                {patient.name}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                    {patient.email}
                  </div>
                  <div className="flex items-center mt-1">
                    <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                    {patient.phone}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {formatDate(patient.lastMessageDate)}
              </TableCell>
              <TableCell>
                {formatDate(patient.lastAppointmentDate)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => onEditClick(patient, e)}
                  >
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  {isDoctor && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => onDeleteClick(patient, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
