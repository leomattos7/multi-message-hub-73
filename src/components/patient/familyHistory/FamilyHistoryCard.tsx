
import React from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FamilyHistoryItem } from "@/types/familyHistory";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FamilyHistoryCardProps {
  familyHistory: FamilyHistoryItem;
  onDelete: (id: string) => void;
  onEdit: (familyHistory: FamilyHistoryItem) => void;
}

export const FamilyHistoryCard = ({ 
  familyHistory, 
  onDelete,
  onEdit 
}: FamilyHistoryCardProps) => {
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
                  onClick={() => onEdit(familyHistory)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar histórico</p>
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
                  onClick={() => onDelete(familyHistory.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Excluir histórico</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="font-medium text-xs pr-12">{familyHistory.description}</div>
        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-gray-500">
          {familyHistory.relationship && (
            <span className="font-medium">Parentesco: {familyHistory.relationship}</span>
          )}
          {(familyHistory.cid || familyHistory.ciap) && (
            <div className="flex flex-wrap gap-x-3">
              {familyHistory.cid && <span>CID: {familyHistory.cid}</span>}
              {familyHistory.ciap && <span>CIAP: {familyHistory.ciap}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
