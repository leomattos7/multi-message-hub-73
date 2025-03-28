
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, ChevronRight } from "lucide-react";
import { Patient } from "@/types/patient";

interface PatientCardProps {
  patient: Patient;
  onClick: (patient: Patient) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  // Use either full_name or name depending on what's available
  const displayName = patient.full_name || patient.name;
  
  return (
    <Card 
      key={patient.id} 
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onClick(patient)}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-gray-500" />
            <h3 className="font-medium">{displayName}</h3>
          </div>
          
          <div className="ml-7 text-sm text-gray-500 space-y-1 mt-1">
            {patient.email && <p>{patient.email}</p>}
            {patient.phone && <p>{patient.phone}</p>}
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="mr-4 text-right">
            <span className="text-sm text-gray-500">Registros</span>
            <p className="font-medium">{patient.record_count}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
};
