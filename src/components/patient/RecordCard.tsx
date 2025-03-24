
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenText, Calendar, FileText } from "lucide-react";

interface RecordCardProps {
  record: {
    id: string;
    record_type: string;
    content: string;
    created_at: string;
  };
  recordTypeDisplay: Record<string, string>;
  formatDate: (dateString: string) => string;
  extractSummary: (content: string) => string;
  onClick: (record: any) => void;
}

export const RecordCard: React.FC<RecordCardProps> = ({
  record,
  recordTypeDisplay,
  formatDate,
  extractSummary,
  onClick,
}) => {
  return (
    <Card 
      key={record.id} 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(record)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {record.record_type === 'soap' ? (
              <BookOpenText className="h-5 w-5 text-blue-500" />
            ) : (
              <FileText className="h-5 w-5 text-blue-500" />
            )}
            <CardTitle className="text-lg">{recordTypeDisplay[record.record_type] || record.record_type}</CardTitle>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(record.created_at)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3">{extractSummary(record.content)}</p>
      </CardContent>
    </Card>
  );
};
