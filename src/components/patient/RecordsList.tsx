
import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SoapNotes } from "./SoapNotesForm";
import { RecordsListDisplay } from "./RecordsListDisplay";
import { TodayConsultationTab } from "./TodayConsultationTab";
import { TasksTab } from "./TasksTab";
import { formatDate, extractSummary, recordTypeDisplay, isToday } from "@/utils/records-utils";

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
  onSaveConsultation?: (notes: SoapNotes) => Promise<void>;
  isSaving?: boolean;
}

export const RecordsList = ({
  records,
  isLoading,
  activeTab,
  onTabChange,
  onSaveConsultation,
  isSaving = false,
}: RecordsListProps) => {
  const navigate = useNavigate();

  const viewRecordDetails = (record: MedicalRecord) => {
    navigate(`/prontuarios/${record.id}`);
  };

  // Filter records for today's consultation
  const todayRecords = records?.filter(record => isToday(record.created_at));

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full flex overflow-x-auto mb-6">
        <TabsTrigger value="today" className="flex-1">Consulta de hoje</TabsTrigger>
        <TabsTrigger value="history" className="flex-1">Histórico</TabsTrigger>
        <TabsTrigger value="tasks" className="flex-1">Tarefas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="today" className="mt-0">
        <TodayConsultationTab
          todayRecords={todayRecords}
          isLoading={isLoading}
          viewRecordDetails={viewRecordDetails}
          onSaveConsultation={onSaveConsultation}
          isSaving={isSaving}
        />
      </TabsContent>

      <TabsContent value="history" className="mt-0">
        <RecordsListDisplay
          records={records}
          isLoading={isLoading}
          recordTypeDisplay={recordTypeDisplay}
          formatDate={formatDate}
          extractSummary={extractSummary}
          viewRecordDetails={viewRecordDetails}
        />
      </TabsContent>

      <TabsContent value="tasks" className="mt-0">
        <TasksTab />
      </TabsContent>
    </Tabs>
  );
};
