
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MedicationItem } from "@/types/medication";

interface MedicationCardProps {
  medication: MedicationItem;
  onDelete: (id: string) => void;
}

export const MedicationCard = ({ medication, onDelete }: MedicationCardProps) => {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-3 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-500 hover:text-red-500"
          onClick={() => onDelete(medication.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <div className="font-medium pr-6">{medication.name}</div>
      </CardContent>
    </Card>
  );
};
