
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Patient {
  id: string;
  name: string;
}

interface PatientInfoProps {
  patient?: Patient;
  onNewRecord: () => void;
}

export const PatientInfo = ({ patient, onNewRecord }: PatientInfoProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate("/prontuarios")} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">{patient?.name}</h1>
      </div>
      
      <Button onClick={onNewRecord}>
        <span className="h-4 w-4 mr-2">+</span>
        Novo Registro
      </Button>
    </div>
  );
};
