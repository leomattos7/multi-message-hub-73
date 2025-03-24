
import React from "react";
import { Card } from "@/components/ui/card";
import { Users, FileText } from "lucide-react";

interface RecordSummary {
  record_type: string;
  count: number;
}

interface MedicalRecordStatsProps {
  patientsCount: number;
  recordSummary?: RecordSummary[];
}

export const MedicalRecordStats: React.FC<MedicalRecordStatsProps> = ({ 
  patientsCount, 
  recordSummary 
}) => {
  const getTotalRecordCount = (): number => {
    if (!recordSummary) return 0;
    return recordSummary.reduce((sum, r) => sum + r.count, 0);
  };

  const getRecordTypeCount = (type: string): number => {
    if (!recordSummary) return 0;
    const found = recordSummary.find(r => r.record_type === type);
    return found ? found.count : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="col-span-1 p-4 flex flex-col space-y-2">
        <div className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          <h3 className="font-medium">Total de Pacientes</h3>
        </div>
        <p className="text-2xl font-bold">{patientsCount}</p>
      </Card>
      
      <Card className="col-span-1 p-4 flex flex-col space-y-2">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-green-500" />
          <h3 className="font-medium">Total de Agendamentos</h3>
        </div>
        <p className="text-2xl font-bold">{getTotalRecordCount()}</p>
      </Card>
      
      <Card className="col-span-1 p-4 flex flex-col space-y-2">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-orange-500" />
          <h3 className="font-medium">Tarefas</h3>
        </div>
        <p className="text-2xl font-bold">{getRecordTypeCount('anamnesis')}</p>
      </Card>
      
      <Card className="col-span-1 p-4 flex flex-col space-y-2">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-purple-500" />
          <h3 className="font-medium">Consultas</h3>
        </div>
        <p className="text-2xl font-bold">{getRecordTypeCount('consultation')}</p>
      </Card>
    </div>
  );
};
