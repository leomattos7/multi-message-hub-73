
import React from "react";
import { HistoryIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HistoricalDataMap, ParameterItem } from "./types";
import { formatDateLocal, getParameterHistory } from "./utils";

interface ParameterHistoryProps {
  item: ParameterItem;
  historicalData: HistoricalDataMap;
}

export const ParameterHistory: React.FC<ParameterHistoryProps> = ({ 
  item, 
  historicalData 
}) => {
  const history = getParameterHistory(item.id, historicalData);
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="link" 
          className="p-0 h-auto font-medium text-left hover:underline"
        >
          {item.field}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <HistoryIcon className="h-4 w-4 text-blue-500" />
            <h4 className="font-semibold text-sm">Histórico de {item.field}</h4>
          </div>
          <div className="border-t pt-2 mt-2">
            {history.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                <div className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded border border-blue-200">
                  <div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded mr-1">Atual</span>
                    {formatDateLocal(item.collectedAt)}
                  </div>
                </div>
                {history.map((historyItem, index) => (
                  <div key={index} className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded">
                    <div>
                      <span className="font-medium">{historyItem.value}</span>
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
