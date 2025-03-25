
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateTimeBlockSelector, TimeBlock } from "@/components/DateTimeBlockSelector";
import { toast } from "sonner";

interface AvailabilityTabProps {
  availableTimes: TimeBlock[];
  onAvailableTimesChange: (blocks: TimeBlock[]) => void;
}

const AvailabilityTab = ({ availableTimes, onAvailableTimesChange }: AvailabilityTabProps) => {
  // Function to handle changes to available times
  const handleAvailableTimesChange = (blocks: TimeBlock[]) => {
    onAvailableTimesChange(blocks);
    // In a real implementation, you would save these to your database
    toast.success(`${blocks.length} horários disponíveis configurados`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horários Disponíveis</CardTitle>
        <CardDescription>
          Configure os dias e horários em que você está disponível para atendimentos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DateTimeBlockSelector 
          blocks={availableTimes}
          onChange={handleAvailableTimesChange}
          mode="available"
        />
      </CardContent>
    </Card>
  );
};

export default AvailabilityTab;
