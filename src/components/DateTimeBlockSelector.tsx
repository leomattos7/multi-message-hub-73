
import React, { useState } from "react";
import { toast } from "sonner";
import { generateAllTimeSlots } from "@/utils/timeSlotUtils";
import { TimeBlockComponent } from "@/components/schedule/timeBlocks/TimeBlock";
import { AddBlockButton } from "@/components/schedule/timeBlocks/AddBlockButton";
import { TimezoneInfo } from "@/components/schedule/timeBlocks/TimezoneInfo";
import { TimeBlock } from "@/components/schedule/timeBlocks/types";
import { format } from "date-fns";

export type { TimeBlock } from "@/components/schedule/timeBlocks/types";

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
    
    const formattedDate = format(removedBlock.date, "dd MMM. yyyy");
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
        <TimeBlockComponent
          key={index}
          block={block}
          index={index}
          isDuplicateDate={isDuplicateDate}
          onRemove={removeBlock}
          onUpdateDate={updateBlockDate}
          onUpdateTime={updateBlockTime}
          timeSlots={TIME_SLOTS}
          mode={mode}
        />
      ))}

      <AddBlockButton onAdd={addBlock} mode={mode} />
      <TimezoneInfo timezone={timezone} />
    </div>
  );
}
