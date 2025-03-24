
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SoapNotesForm, SoapNotes } from "./soap/SoapNotesForm";
import { RecordsListDisplay } from "./RecordsListDisplay";
import { EmptyStateDisplay } from "./EmptyStateDisplay";
import { formatDate, extractSummary, recordTypeDisplay } from "@/utils/records-utils";

interface MedicalRecord {
  id: string;
  patient_id: string;
  record_date: string;
  record_type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface TodayConsultationTabProps {
  todayRecords?: MedicalRecord[];
  isLoading: boolean;
  viewRecordDetails: (record: MedicalRecord) => void;
  onSaveConsultation?: (notes: SoapNotes) => Promise<boolean>;
  isSaving?: boolean;
}

export const TodayConsultationTab: React.FC<TodayConsultationTabProps> = ({
  todayRecords,
  isLoading,
  viewRecordDetails,
  onSaveConsultation,
  isSaving = false,
}) => {
  // Format today's date in Portuguese
  const today = new Date();
  const formattedDate = format(today, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando registros...</p>
      </div>
    );
  }

  if (todayRecords && todayRecords.length > 0) {
    return (
      <RecordsListDisplay
        records={todayRecords}
        isLoading={isLoading}
        recordTypeDisplay={recordTypeDisplay}
        formatDate={formatDate}
        extractSummary={extractSummary}
        viewRecordDetails={viewRecordDetails}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-4">Consulta de {formattedDate}</h3>
        <SoapNotesForm 
          onSave={onSaveConsultation || (() => Promise.resolve(true))} 
          isLoading={isSaving}
        />
      </div>
    </div>
  );
};
