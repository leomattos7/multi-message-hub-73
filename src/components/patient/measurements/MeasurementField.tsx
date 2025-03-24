
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface MeasurementFieldProps {
  id: string;
  label: string;
  value: number | null;
  onClick: () => void;
  colorClass?: string;
}

export function MeasurementField({ 
  id, 
  label, 
  value, 
  onClick, 
  colorClass = "" 
}: MeasurementFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={value ?? "-"}
          readOnly
          className={`text-lg font-medium py-6 px-4 bg-gray-50 pr-10 ${colorClass}`}
        />
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          onClick={onClick}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
