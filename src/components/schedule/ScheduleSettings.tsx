import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarClock, ListChecks, Clock } from "lucide-react";
import { useScheduleSettings } from "@/hooks/useScheduleSettings";
import AvailabilityTab from "./AvailabilityTab";
import BlockedTimesTab from "./BlockedTimesTab";
import ConsultationTypesTab from "./ConsultationTypesTab";

const ScheduleSettings = () => {
  const doctorId = "00000000-0000-0000-0000-000000000000";

  const {
    activeTab,
    setActiveTab,
    blockedTimes,
    setBlockedTimes,
    weeklyAvailability,
    setWeeklyAvailability,
    consultationTypes,
    setConsultationTypes,
    isLoading,
    setIsLoading,
  } = useScheduleSettings(doctorId);

  return (
    <div className="mt-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger
            value="availability"
            className="flex items-center gap-1.5"
          >
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
          <Card>
            <CardHeader>
              <CardTitle>Horários Disponíveis</CardTitle>
              <CardDescription>
                Configure os dias e horários em que você está disponível para
                atendimentos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvailabilityTab
                doctorId={doctorId}
                weeklyAvailability={weeklyAvailability}
                setWeeklyAvailability={setWeeklyAvailability}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bloqueios de Agenda</CardTitle>
              <CardDescription>
                Configure datas e horários que você deseja bloquear na sua
                agenda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlockedTimesTab
                blockedTimes={blockedTimes}
                setBlockedTimes={setBlockedTimes}
                doctorId={doctorId}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Consulta1</CardTitle>
              <CardDescription>
                Configure os tipos de consulta que você oferece e suas durações.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsultationTypesTab
                doctorId={doctorId}
                consultationTypes={consultationTypes}
                setConsultationTypes={setConsultationTypes}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleSettings;
