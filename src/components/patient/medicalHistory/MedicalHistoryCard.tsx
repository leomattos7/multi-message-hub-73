
import React from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MedicalHistoryItem } from "@/types/medicalHistory";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MedicalHistoryCardProps {
  medicalHistory: MedicalHistoryItem;
  onDelete: (id: string) => void;
  onEdit: (medicalHistory: MedicalHistoryItem) => void;
}

export const MedicalHistoryCard = ({ 
  medicalHistory, 
  onDelete, 
  onEdit 
}: MedicalHistoryCardProps) => {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-3 relative">
        <div className="absolute top-2 right-2 flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 text-gray-500 hover:text-blue-500"
                  onClick={() => onEdit(medicalHistory)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar antecedente</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                  onClick={() => onDelete(medicalHistory.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Excluir antecedente</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="font-medium pr-12">{medicalHistory.description}</div>
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
