
import React from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MedicationItem } from "@/types/medication";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MedicationCardProps {
  medication: MedicationItem;
  onDelete: (id: string) => void;
  onEdit: (medication: MedicationItem) => void;
}

export const MedicationCard = ({ medication, onDelete, onEdit }: MedicationCardProps) => {
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
                  onClick={() => onEdit(medication)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar medicação</p>
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
                  onClick={() => onDelete(medication.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Excluir medicação</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="font-medium pr-16">{medication.name}</div>
        {medication.dosage && (
          <div className="text-sm text-gray-600">Dosagem: {medication.dosage}</div>
        )}
        {medication.instructions && (
          <div className="text-sm text-gray-600">Instruções: {medication.instructions}</div>
        )}
      </CardContent>
    </Card>
  );
};
