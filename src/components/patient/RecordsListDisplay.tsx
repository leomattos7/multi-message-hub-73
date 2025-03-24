
import React from "react";
import { RecordCard } from "./RecordCard";
import { EmptyStateDisplay } from "./EmptyStateDisplay";

interface MedicalRecord {
  id: string;
  patient_id: string;
  record_date: string;
  record_type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface RecordsListDisplayProps {
  records?: MedicalRecord[];
  isLoading: boolean;
  recordTypeDisplay: Record<string, string>;
  formatDate: (dateString: string) => string;
  extractSummary: (content: string) => string;
  viewRecordDetails: (record: MedicalRecord) => void;
  emptyMessage?: string;
}

export const RecordsListDisplay: React.FC<RecordsListDisplayProps> = ({
  records,
  isLoading,
  recordTypeDisplay,
  formatDate,
  extractSummary,
  viewRecordDetails,
  emptyMessage = "Crie seu primeiro registro clicando no botão \"Novo Registro\"",
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando registros...</p>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <EmptyStateDisplay
        title="Nenhum registro encontrado"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <RecordCard
          key={record.id}
          record={record}
          recordTypeDisplay={recordTypeDisplay}
          formatDate={formatDate}
          extractSummary={extractSummary}
          onClick={viewRecordDetails}
        />
      ))}
    </div>
  );
};
