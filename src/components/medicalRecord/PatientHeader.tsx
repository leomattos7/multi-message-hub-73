
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, User } from "lucide-react";

interface PatientHeaderProps {
  patient: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  onBackClick: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ patient, onBackClick }) => {
  return (
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="icon" onClick={onBackClick}>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center space-x-3">
        <div className="bg-blue-100 p-2 rounded-full">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        
        <div>
          <h2 className="text-lg font-medium">{patient.name}</h2>
          <div className="text-sm text-gray-500">
            {patient.email && <p>{patient.email}</p>}
            {patient.phone && <p>{patient.phone}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
