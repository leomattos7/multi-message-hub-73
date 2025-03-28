
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HistoryIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ParameterHistory } from "./types";
import { historicalData } from "./mockData";

interface ParameterHistoryProps {
  parameterId: string;
  field: string;
  currentValue: string;
  currentUnit: string;
  currentDate: string;
}

export const ParameterHistoryDisplay: React.FC<ParameterHistoryProps> = ({
  parameterId,
  field,
  currentValue,
  currentUnit,
  currentDate
}) => {
  // Format date in Brazilian Portuguese format
  const formatDateLocal = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  // Get historic data for a parameter and sort by date (newest first)
  const getParameterHistory = (id: string) => {
    // Direct import from mock data without any DB calls
    const history = historicalData[id as keyof typeof historicalData] || [];
    
    // Sort history by date, newest first
    return [...history].sort((a, b) => {
      return new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime();
    });
  };

  const parameterHistory = getParameterHistory(parameterId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="link" 
          className="p-0 h-auto font-medium text-left hover:underline"
        >
          {field}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <HistoryIcon className="h-4 w-4 text-blue-500" />
            <h4 className="font-semibold text-sm">Histórico de {field}</h4>
          </div>
          <div className="border-t pt-2 mt-2">
            {parameterHistory.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                <div className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded border border-blue-200">
                  <div>
                    <span className="font-medium">{currentValue}</span> {currentUnit}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded mr-1">Atual</span>
                    {formatDateLocal(currentDate)}
                  </div>
                </div>
                {parameterHistory.map((historyItem, index) => (
                  <div key={index} className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded">
                    <div>
                      <span className="font-medium">{historyItem.value}</span> {historyItem.unit}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDateLocal(historyItem.collectedAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-2">
                Não há registros históricos para este parâmetro.
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
