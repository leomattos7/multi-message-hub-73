
import React, { useState } from "react";
import { Users } from "lucide-react";
import { PatientCard } from "./PatientCard";
import { Button } from "@/components/ui/button";

interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  record_count?: number;
}

interface PatientListProps {
  patients?: Patient[];
  isLoading: boolean;
  searchQuery: string;
  onPatientClick: (patient: Patient) => void;
}

// Mock patient data for debugging
const mockPatients = [
  {
    id: "mock-1",
    name: "Maria Silva",
    email: "maria.silva@example.com",
    phone: "(11) 98765-4321",
    record_count: 5,
    birth_date: "1985-05-15",
    cpf: "123.456.789-00",
    biological_sex: "female",
    gender_identity: "woman"
  },
  {
    id: "mock-2",
    name: "João Santos",
    email: "joao.santos@example.com",
    phone: "(21) 99876-5432",
    record_count: 3,
    birth_date: "1990-08-23",
    cpf: "987.654.321-00",
    biological_sex: "male",
    gender_identity: "man"
  },
  {
    id: "mock-3",
    name: "Ana Oliveira",
    email: "ana.oliveira@example.com",
    phone: "(31) 97654-3210",
    record_count: 8,
    birth_date: "1978-11-30",
    cpf: "456.789.123-00",
    biological_sex: "female",
    gender_identity: "woman"
  }
];

export const PatientList: React.FC<PatientListProps> = ({ 
  patients, 
  isLoading, 
  searchQuery, 
  onPatientClick 
}) => {
  const [showMockData, setShowMockData] = useState(true); // Set to true by default for debugging
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando pacientes...</p>
      </div>
    );
  }

  if ((!patients || patients.length === 0) && !showMockData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
        <Users className="h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-600">Nenhum paciente encontrado</h3>
        <p className="text-gray-500 mt-1 mb-4">
          {searchQuery ? 'Tente uma busca diferente' : 'Adicione seu primeiro paciente clicando no botão "Novo Paciente"'}
        </p>
        <Button onClick={() => setShowMockData(true)}>
          Carregar Pacientes de Exemplo
        </Button>
      </div>
    );
  }

  const displayPatients = showMockData ? mockPatients : patients;

  return (
    <div className="space-y-3">
      {showMockData && (
        <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm">
          <p className="font-medium">Dados de exemplo carregados</p>
          <p className="text-gray-600">Estes são pacientes fictícios para fins de teste.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={() => setShowMockData(false)}
          >
            Voltar para dados reais
          </Button>
        </div>
      )}
      
      {displayPatients?.map((patient) => (
        <PatientCard 
          key={patient.id} 
          patient={patient} 
          onClick={onPatientClick} 
        />
      ))}
    </div>
  );
};
