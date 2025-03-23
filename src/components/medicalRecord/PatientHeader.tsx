
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface Patient {
  id: string;
  name: string;
  birth_date?: string;
  biological_sex?: string;
  gender_identity?: string;
}

interface PatientHeaderProps {
  patient?: Patient;
  onBackClick: () => void;
}

export const PatientHeader = ({ patient, onBackClick }: PatientHeaderProps) => {
  const calculateAge = (birthDate: string | undefined): number => {
    if (!birthDate) return 0;
    
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatBirthDate = (birthDate: string | undefined): string => {
    if (!birthDate) return 'Não informado';
    
    const date = new Date(birthDate);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="flex items-center">
      <Button variant="ghost" onClick={onBackClick} className="mr-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>
      
      <div className="flex items-center">
        <h1 className="text-2xl font-bold mr-2">{patient?.name}</h1>
        
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Info className="h-5 w-5 text-blue-500" />
              <span className="sr-only">Informações adicionais</span>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Informações Pessoais</h4>
              <div className="flex justify-between">
                <span className="text-sm">Idade:</span>
                <span className="text-sm font-medium">
                  {patient?.birth_date ? `${calculateAge(patient.birth_date)} anos` : 'Não informado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Data de Nascimento:</span>
                <span className="text-sm font-medium">{formatBirthDate(patient?.birth_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Sexo Biológico:</span>
                <span className="text-sm font-medium">
                  {patient?.biological_sex === 'male' ? 'Masculino' : 
                    patient?.biological_sex === 'female' ? 'Feminino' : 
                    patient?.biological_sex === 'intersex' ? 'Intersexo' : 'Não informado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Identidade de Gênero:</span>
                <span className="text-sm font-medium">
                  {patient?.gender_identity === 'man' ? 'Homem' : 
                    patient?.gender_identity === 'woman' ? 'Mulher' : 
                    patient?.gender_identity === 'non_binary' ? 'Não-Binário' : 
                    patient?.gender_identity === 'other' ? 'Outro' : 'Não informado'}
                </span>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
};
