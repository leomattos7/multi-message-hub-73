
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateTimeBlockSelector, TimeBlock } from "@/components/DateTimeBlockSelector";
import { toast } from "sonner";

interface BlockedTimesTabProps {
  blockedTimes: TimeBlock[];
  onBlockedTimesChange: (blocks: TimeBlock[]) => void;
}

const BlockedTimesTab = ({ blockedTimes, onBlockedTimesChange }: BlockedTimesTabProps) => {
  // Function to handle changes to blocked times
  const handleBlockedTimesChange = (blocks: TimeBlock[]) => {
    onBlockedTimesChange(blocks);
    // In a real implementation, you would save these to your database
    toast.success(`${blocks.length} bloqueios de agenda configurados`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bloqueios de Agenda</CardTitle>
        <CardDescription>
          Configure datas e horários que você deseja bloquear na sua agenda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DateTimeBlockSelector 
          blocks={blockedTimes}
          onChange={handleBlockedTimesChange}
          mode="block"
        />
      </CardContent>
    </Card>
  );
};

export default BlockedTimesTab;
