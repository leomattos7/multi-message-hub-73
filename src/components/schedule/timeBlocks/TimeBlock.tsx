
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { TimeBlock as TimeBlockType } from "./types";

interface TimeBlockProps {
  block: TimeBlockType;
  index: number;
  isDuplicateDate: (date: Date, index: number) => boolean;
  onRemove: (index: number) => void;
  onUpdateDate: (index: number, date: Date) => void;
  onUpdateTime: (index: number, field: 'startTime' | 'endTime', value: string) => void;
  timeSlots: string[];
  mode?: "available" | "block";
}

export const TimeBlockComponent: React.FC<TimeBlockProps> = ({
  block,
  index,
  isDuplicateDate,
  onRemove,
  onUpdateDate,
  onUpdateTime,
  timeSlots,
  mode = "block"
}) => {
  return (
    <div 
      className={cn(
        "flex flex-col sm:flex-row gap-2 p-3 rounded-lg border",
        mode === "available" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      )}
    >
      <div className="flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal", 
                mode === "available" 
                  ? "bg-green-100 hover:bg-green-200 border-green-200"
                  : "bg-red-100 hover:bg-red-200 border-red-200",
                isDuplicateDate(block.date, index) && "border-yellow-500 bg-yellow-100"
              )}
            >
              {format(block.date, "dd MMM. yyyy", { locale: ptBR })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={block.date}
              onSelect={(date) => date && onUpdateDate(index, date)}
              disabled={(date) => date < new Date("1900-01-01")}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {isDuplicateDate(block.date, index) && (
          <div className="text-yellow-600 text-xs mt-1">
            Atenção: Esta data foi adicionada mais de uma vez
          </div>
        )}
      </div>
      
      <div className="flex gap-2 items-center">
        <Select 
          value={block.startTime} 
          onValueChange={(value) => onUpdateTime(index, 'startTime', value)}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Início" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <ScrollArea className="h-[200px]">
              {timeSlots.map(time => (
                <SelectItem key={`start-${time}`} value={time}>{time}</SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
        
        <span className="text-gray-500">–</span>
        
        <Select 
          value={block.endTime} 
          onValueChange={(value) => onUpdateTime(index, 'endTime', value)}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Fim" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <ScrollArea className="h-[200px]">
              {timeSlots.map(time => (
                <SelectItem key={`end-${time}`} value={time}>{time}</SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "text-gray-400 hover:text-gray-600",
            mode === "available" ? "hover:bg-green-100" : "hover:bg-red-100"
          )}
          onClick={() => onRemove(index)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
