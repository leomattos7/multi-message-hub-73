
import React from "react";
import { Users } from "lucide-react";
import { PatientCard } from "./PatientCard";
import { Patient } from "@/types/patient";

interface PatientListProps {
  patients?: Patient[];
  isLoading: boolean;
  searchQuery: string;
  onPatientClick: (patient: Patient) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ 
  patients, 
  isLoading, 
  searchQuery, 
  onPatientClick 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando pacientes...</p>
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
        <Users className="h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-600">Nenhum paciente encontrado</h3>
        <p className="text-gray-500 mt-1">
          {searchQuery ? 'Tente uma busca diferente' : 'Adicione seu primeiro paciente clicando no botão "Novo Paciente"'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {patients.map((patient) => (
        <PatientCard 
          key={patient.id} 
          patient={patient} 
          onClick={onPatientClick} 
        />
      ))}
    </div>
  );
};
