
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface RecordContentProps {
  content: string;
  isEditing: boolean;
  editedContent: string;
  onContentChange: (content: string) => void;
}

export const RecordContent = ({ 
  content, 
  isEditing, 
  editedContent, 
  onContentChange 
}: RecordContentProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Conteúdo</h2>
        
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-[300px]"
          />
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg min-h-[300px] whitespace-pre-wrap">
            {content}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
