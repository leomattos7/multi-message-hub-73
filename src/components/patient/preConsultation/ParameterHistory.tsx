
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HistoryIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HistoricalDataMap, ParameterItem } from "./types";
import { formatDateLocal, getParameterHistory } from "./utils";

interface ParameterHistoryProps {
  item: ParameterItem;
  historicalData: HistoricalDataMap;
}

export const ParameterHistory: React.FC<ParameterHistoryProps> = ({ item, historicalData }) => {
  const [open, setOpen] = useState(false);
  const history = getParameterHistory(item.id, historicalData);
  
  if (history.length === 0) {
    return <span>{item.field}</span>;
  }

  return (
    <div className="flex items-center">
      <span className="mr-2">{item.field}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <HistoryIcon className="h-4 w-4" />
            <span className="sr-only">Histórico</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div className="p-3">
            <h4 className="font-medium mb-2">Histórico de {item.field}</h4>
            <div className="text-sm divide-y max-h-60 overflow-auto">
              {history.map((record, index) => (
                <div key={index} className="py-2">
                  <div className="font-medium">{record.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDateLocal(record.collectedAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
