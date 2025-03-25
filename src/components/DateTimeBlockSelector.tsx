
import React, { useState } from "react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateAllTimeSlots } from "@/utils/timeSlotUtils";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface TimeBlock {
  id?: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface DateTimeBlockSelectorProps {
  blocks: TimeBlock[];
  onChange: (blocks: TimeBlock[]) => void;
  timezone?: string;
  mode?: "available" | "block";
}

// Get all possible time slots from 00:00 to 23:30
const TIME_SLOTS = generateAllTimeSlots();

export function DateTimeBlockSelector({
  blocks = [],
  onChange,
  timezone = "(GMT-03:00) Horário Padrão de Brasília - São Paulo",
  mode = "block"
}: DateTimeBlockSelectorProps) {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(blocks);

  // Add a new empty block
  const addBlock = () => {
    const today = new Date();
    const newBlock: TimeBlock = {
      date: today,
      startTime: "08:00",
      endTime: "17:00"
    };
    const updatedBlocks = [...timeBlocks, newBlock];
    setTimeBlocks(updatedBlocks);
    onChange(updatedBlocks);
  };

  // Remove a block
  const removeBlock = (index: number) => {
    const updatedBlocks = [...timeBlocks];
    const removedBlock = updatedBlocks.splice(index, 1)[0];
    setTimeBlocks(updatedBlocks);
    onChange(updatedBlocks);
    
    const formattedDate = format(removedBlock.date, "dd MMM. yyyy", { locale: ptBR });
    toast.success(`${mode === "available" ? "Horário disponível" : "Bloco de horário"} removido: ${formattedDate} ${removedBlock.startTime} - ${removedBlock.endTime}`);
  };

  // Update a block's date
  const updateBlockDate = (index: number, date: Date) => {
    const updatedBlocks = [...timeBlocks];
    updatedBlocks[index] = { ...updatedBlocks[index], date };
    setTimeBlocks(updatedBlocks);
    onChange(updatedBlocks);
  };

  // Update a block's time
  const updateBlockTime = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const updatedBlocks = [...timeBlocks];
    updatedBlocks[index] = { ...updatedBlocks[index], [field]: value };
    
    // Validate start time is before end time
    if (field === 'startTime' && value >= updatedBlocks[index].endTime) {
      toast.error("O horário inicial deve ser anterior ao horário final");
      return;
    }
    
    if (field === 'endTime' && value <= updatedBlocks[index].startTime) {
      toast.error("O horário final deve ser posterior ao horário inicial");
      return;
    }
    
    setTimeBlocks(updatedBlocks);
    onChange(updatedBlocks);
  };

  // Check if a date appears more than once in the blocks
  const isDuplicateDate = (date: Date, index: number): boolean => {
    const dateString = format(date, "yyyy-MM-dd");
    return timeBlocks.some((block, i) => 
      i !== index && format(block.date, "yyyy-MM-dd") === dateString
    );
  };

  return (
    <div className="space-y-4">
      {timeBlocks.map((block, index) => (
        <div 
          key={index} 
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
                  onSelect={(date) => date && updateBlockDate(index, date)}
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
              onValueChange={(value) => updateBlockTime(index, 'startTime', value)}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Início" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <ScrollArea className="h-[200px]">
                  {TIME_SLOTS.map(time => (
                    <SelectItem key={`start-${time}`} value={time}>{time}</SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            
            <span className="text-gray-500">–</span>
            
            <Select 
              value={block.endTime} 
              onValueChange={(value) => updateBlockTime(index, 'endTime', value)}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Fim" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <ScrollArea className="h-[200px]">
                  {TIME_SLOTS.map(time => (
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
              onClick={() => removeBlock(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button 
        variant={mode === "available" ? "available" : "block"}
        className="w-full border-dashed"
        onClick={addBlock}
      >
        <Plus className="mr-2 h-4 w-4" /> 
        Adicionar {mode === "available" ? "disponibilidade" : "bloqueio"}
      </Button>

      <div className="text-sm text-gray-500 mt-2">
        {timezone}
      </div>
    </div>
  );
}
