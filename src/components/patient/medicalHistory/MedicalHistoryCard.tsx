
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MedicalHistoryItem } from "@/types/medicalHistory";

interface MedicalHistoryCardProps {
  medicalHistory: MedicalHistoryItem;
  onDelete: (id: string) => void;
}

export const MedicalHistoryCard = ({ medicalHistory, onDelete }: MedicalHistoryCardProps) => {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-3 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-500 hover:text-red-500"
          onClick={() => onDelete(medicalHistory.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <div className="font-medium pr-6">{medicalHistory.description}</div>
        {(medicalHistory.cid || medicalHistory.ciap) && (
          <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-gray-500">
            {medicalHistory.cid && <span>CID: {medicalHistory.cid}</span>}
            {medicalHistory.ciap && <span>CIAP: {medicalHistory.ciap}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
