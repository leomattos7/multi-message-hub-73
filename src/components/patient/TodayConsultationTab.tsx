
import React from "react";
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
  onSaveConsultation?: (notes: SoapNotes) => Promise<void>;
  isSaving?: boolean;
}

export const TodayConsultationTab: React.FC<TodayConsultationTabProps> = ({
  todayRecords,
  isLoading,
  viewRecordDetails,
  onSaveConsultation,
  isSaving = false,
}) => {
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
        <h3 className="text-lg font-medium mb-4">Nova Consulta</h3>
        <SoapNotesForm 
          onSave={onSaveConsultation || (() => Promise.resolve())} 
          isLoading={isSaving}
        />
      </div>
    </div>
  );
};
