
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeBlock } from "@/components/DateTimeBlockSelector";
import { CalendarClock, Clock, ListChecks } from "lucide-react";

// Import the tab components
import AvailabilityTab from "./settings/AvailabilityTab";
import BlockedTimesTab from "./settings/BlockedTimesTab";
import ConsultationTypesTab from "./settings/ConsultationTypesTab";

interface ScheduleSettingsProps {
  doctorId: string;
}

const ScheduleSettings = ({ doctorId }: ScheduleSettingsProps) => {
  const [activeTab, setActiveTab] = useState<string>("availability");
  const [blockedTimes, setBlockedTimes] = useState<TimeBlock[]>([]);
  const [availableTimes, setAvailableTimes] = useState<TimeBlock[]>([]);

  return (
    <div className="mt-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="availability" className="flex items-center gap-1.5">
            <CalendarClock className="h-4 w-4" />
            <span>Disponibilidade</span>
          </TabsTrigger>
          <TabsTrigger value="blocked" className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>Bloqueios</span>
          </TabsTrigger>
          <TabsTrigger value="types" className="flex items-center gap-1.5">
            <ListChecks className="h-4 w-4" />
            <span>Tipos</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="availability" className="space-y-4">
          <AvailabilityTab 
            availableTimes={availableTimes}
            onAvailableTimesChange={setAvailableTimes}
            doctorId={doctorId}
          />
        </TabsContent>
        
        <TabsContent value="blocked" className="space-y-4">
          <BlockedTimesTab 
            blockedTimes={blockedTimes}
            onBlockedTimesChange={setBlockedTimes}
          />
        </TabsContent>
        
        <TabsContent value="types" className="space-y-4">
          <ConsultationTypesTab doctorId={doctorId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleSettings;
