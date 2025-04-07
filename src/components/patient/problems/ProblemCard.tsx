
import React from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProblemItem } from "@/types/problem";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProblemCardProps {
  problem: ProblemItem;
  onDelete: (id: string) => void;
  onEdit: (problem: ProblemItem) => void;
}

export const ProblemCard = ({ problem, onDelete, onEdit }: ProblemCardProps) => {
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
                  onClick={() => onEdit(problem)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar problema</p>
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
                  onClick={() => onDelete(problem.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Excluir problema</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="font-medium pr-16">{problem.name}</div>
        {problem.cid && (
          <div className="text-sm text-gray-600">CID: {problem.cid}</div>
        )}
        {problem.ciap && (
          <div className="text-sm text-gray-600">CIAP: {problem.ciap}</div>
        )}
      </CardContent>
    </Card>
  );
};
