
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar } from "lucide-react";

interface MedicalRecord {
  id: string;
  patient_id: string;
  record_date: string;
  record_type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface RecordsListProps {
  records?: MedicalRecord[];
  isLoading: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const RecordsList = ({
  records,
  isLoading,
  activeTab,
  onTabChange,
}: RecordsListProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const recordTypeDisplay: Record<string, string> = {
    anamnesis: "Anamnese",
    consultation: "Consulta",
    exam: "Exame",
    prescription: "Receita",
    evolution: "Evolução",
  };

  const viewRecordDetails = (record: MedicalRecord) => {
    navigate(`/prontuarios/${record.id}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full flex overflow-x-auto mb-6">
        <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
        <TabsTrigger value="anamnesis" className="flex-1">Anamnese</TabsTrigger>
        <TabsTrigger value="consultation" className="flex-1">Consulta</TabsTrigger>
        <TabsTrigger value="exam" className="flex-1">Exame</TabsTrigger>
        <TabsTrigger value="prescription" className="flex-1">Receita</TabsTrigger>
        <TabsTrigger value="evolution" className="flex-1">Evolução</TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab} className="mt-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Carregando registros...</p>
          </div>
        ) : records && records.length > 0 ? (
          <div className="space-y-4">
            {records.map((record) => (
              <Card 
                key={record.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => viewRecordDetails(record)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg">{recordTypeDisplay[record.record_type]}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(record.created_at)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-3">{record.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-600">Nenhum registro encontrado</h3>
            <p className="text-gray-500 mt-1">
              Crie seu primeiro registro clicando no botão "Novo Registro"
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
