
import { useState } from "react";
import { Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TimeRangeSelectorProps {
  startTime: string;
  endTime: string;
  onTimeChange: (startTime: string, endTime: string) => void;
  className?: string;
}

export function TimeRangeSelector({ 
  startTime, 
  endTime, 
  onTimeChange, 
  className 
}: TimeRangeSelectorProps) {
  const [start, setStart] = useState(startTime);
  const [end, setEnd] = useState(endTime);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStart(newStart);
    onTimeChange(newStart, end);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    setEnd(newEnd);
    onTimeChange(start, newEnd);
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="grid gap-1.5">
        <Label htmlFor="start-time">Início</Label>
        <div className="relative">
          <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            id="start-time"
            type="time"
            value={start}
            onChange={handleStartChange}
            className="pl-8"
          />
        </div>
      </div>
      <span className="pt-6 text-gray-500">até</span>
      <div className="grid gap-1.5">
        <Label htmlFor="end-time">Fim</Label>
        <div className="relative">
          <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            id="end-time"
            type="time"
            value={end}
            onChange={handleEndChange}
            className="pl-8"
          />
        </div>
      </div>
    </div>
  );
}
