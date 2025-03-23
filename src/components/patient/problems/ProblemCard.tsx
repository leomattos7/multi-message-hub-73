
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProblemItem } from "@/types/problem";

interface ProblemCardProps {
  problem: ProblemItem;
  onDelete: (id: string) => void;
}

export const ProblemCard = ({ problem, onDelete }: ProblemCardProps) => {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-3 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-500 hover:text-red-500"
          onClick={() => onDelete(problem.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <div className="font-medium pr-6">{problem.name}</div>
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
