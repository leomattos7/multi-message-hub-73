
import React, { useState } from "react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
}

export function DateTimeBlockSelector({
  blocks = [],
  onChange,
  timezone = "(GMT-03:00) Horário Padrão de Brasília - São Paulo"
}: DateTimeBlockSelectorProps) {
  const [newBlocks, setNewBlocks] = useState<TimeBlock[]>(blocks);

  // Add a new empty block
  const addBlock = () => {
    const today = new Date();
    const newBlock: TimeBlock = {
      date: today,
      startTime: "08:00",
      endTime: "17:00"
    };
    const updatedBlocks = [...newBlocks, newBlock];
    setNewBlocks(updatedBlocks);
    onChange(updatedBlocks);
  };

  // Remove a block
  const removeBlock = (index: number) => {
    const updatedBlocks = [...newBlocks];
    const removedBlock = updatedBlocks.splice(index, 1)[0];
    setNewBlocks(updatedBlocks);
    onChange(updatedBlocks);
    
    const formattedDate = format(removedBlock.date, "dd MMM. yyyy", { locale: ptBR });
    toast.success(`Bloco de horário removido: ${formattedDate} ${removedBlock.startTime} - ${removedBlock.endTime}`);
  };

  // Update a block's date
  const updateBlockDate = (index: number, date: Date) => {
    const updatedBlocks = [...newBlocks];
    updatedBlocks[index] = { ...updatedBlocks[index], date };
    setNewBlocks(updatedBlocks);
    onChange(updatedBlocks);
  };

  // Update a block's time
  const updateBlockTime = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const updatedBlocks = [...newBlocks];
    updatedBlocks[index] = { ...updatedBlocks[index], [field]: value };
    setNewBlocks(updatedBlocks);
    onChange(updatedBlocks);
  };

  // Check if a date appears more than once in the blocks
  const isDuplicateDate = (date: Date, index: number): boolean => {
    const dateString = format(date, "yyyy-MM-dd");
    return newBlocks.some((block, i) => 
      i !== index && format(block.date, "yyyy-MM-dd") === dateString
    );
  };

  return (
    <div className="space-y-4">
      {newBlocks.map((block, index) => (
        <div 
          key={index} 
          className="flex flex-col sm:flex-row gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-rose-100 hover:bg-rose-200 border-rose-200",
                    isDuplicateDate(block.date, index) && "border-red-500"
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
                />
              </PopoverContent>
            </Popover>
            {isDuplicateDate(block.date, index) && (
              <div className="text-red-500 text-xs mt-1">
                As mesmas datas foram adicionadas mais de uma vez
              </div>
            )}
          </div>
          
          <div className="flex gap-2 items-center">
            <div className="bg-gray-200 px-3 py-2 rounded">
              <input
                type="time"
                value={block.startTime}
                onChange={(e) => updateBlockTime(index, 'startTime', e.target.value)}
                className="bg-transparent border-none focus:outline-none text-center w-[80px]"
              />
            </div>
            <span className="text-gray-500">–</span>
            <div className="bg-gray-200 px-3 py-2 rounded">
              <input
                type="time"
                value={block.endTime}
                onChange={(e) => updateBlockTime(index, 'endTime', e.target.value)}
                className="bg-transparent border-none focus:outline-none text-center w-[80px]"
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => removeBlock(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button 
        variant="outline" 
        className="w-full border-dashed"
        onClick={addBlock}
      >
        <Plus className="mr-2 h-4 w-4" /> Adicionar uma data
      </Button>

      <div className="text-sm text-gray-500 mt-2">
        {timezone}
      </div>
    </div>
  );
}
