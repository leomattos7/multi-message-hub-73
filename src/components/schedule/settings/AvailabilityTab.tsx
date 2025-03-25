
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateTimeBlockSelector, TimeBlock } from "@/components/DateTimeBlockSelector";
import { VisualWeeklySchedule } from "@/components/schedule/VisualWeeklySchedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AvailabilityTabProps {
  availableTimes: TimeBlock[];
  onAvailableTimesChange: (blocks: TimeBlock[]) => void;
  doctorId: string;
}

type WeeklyAvailability = {
  id?: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

const AvailabilityTab = ({ availableTimes, onAvailableTimesChange, doctorId }: AvailabilityTabProps) => {
  const [weeklyAvailability, setWeeklyAvailability] = useState<WeeklyAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availabilityView, setAvailabilityView] = useState<"calendar" | "weekly">("weekly");

  // Function to handle changes to available times (calendar view)
  const handleAvailableTimesChange = (blocks: TimeBlock[]) => {
    onAvailableTimesChange(blocks);
    // In a real implementation, you would save these to your database
    toast.success(`${blocks.length} horários disponíveis configurados`);
  };

  // Fetch weekly availability
  useEffect(() => {
    const fetchWeeklyAvailability = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("doctor_availability")
          .select("*")
          .eq("doctor_id", doctorId)
          .eq("is_available", true);

        if (error) {
          console.error("Error fetching availability:", error);
          toast.error("Erro ao carregar disponibilidade");
          return;
        }

        if (data) {
          setWeeklyAvailability(data);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Erro ao carregar disponibilidade");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyAvailability();
  }, [doctorId]);

  // Handle updates to weekly availability
  const handleWeeklyAvailabilityChange = (updatedAvailability: WeeklyAvailability[]) => {
    setWeeklyAvailability(updatedAvailability);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disponibilidade</CardTitle>
        <CardDescription>
          Configure os dias e horários em que você está disponível para atendimentos.
        </CardDescription>
        <Tabs value={availabilityView} onValueChange={(value) => setAvailabilityView(value as "calendar" | "weekly")}>
          <TabsList className="grid grid-cols-2 w-[300px]">
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <TabsContent value="weekly" className="mt-0">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Carregando disponibilidade...
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Horários Disponíveis</h2>
                <div className="text-gray-600 mb-6">
                  Configure quais dias e horários você está disponível para atendimento.
                </div>
                
                <VisualWeeklySchedule 
                  doctorId={doctorId}
                  weeklyAvailability={weeklyAvailability}
                  onAvailabilityChange={handleWeeklyAvailabilityChange}
                />
              </div>
              
              <div className="text-sm text-gray-500 mt-2">
                (GMT-03:00) Horário Padrão de Brasília - São Paulo
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="calendar" className="mt-0">
          <DateTimeBlockSelector 
            blocks={availableTimes}
            onChange={handleAvailableTimesChange}
            mode="available"
          />
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default AvailabilityTab;
