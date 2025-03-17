
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Plus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VisualWeeklySchedule } from "@/components/VisualWeeklySchedule";
import { supabase } from "@/integrations/supabase/client";

// Type for doctor availability
type Availability = {
  id?: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

export default function ScheduleManagement() {
  const navigate = useNavigate();
  const [weeklyAvailability, setWeeklyAvailability] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize the doctor ID (in a real app, this would come from authentication)
  const doctorId = "00000000-0000-0000-0000-000000000000"; // Placeholder

  // Fetch doctor's weekly availability
  useEffect(() => {
    const fetchWeeklyAvailability = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("doctor_availability")
          .select("*")
          .eq("doctor_id", doctorId);

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

  // Handle updating weekly availability
  const handleAvailabilityChange = async (updatedAvailability: Availability[]) => {
    // This function is now handled directly in the VisualWeeklySchedule component
    // We just need to update our local state
    setWeeklyAvailability(updatedAvailability);
  };

  return (
    <div className="container max-w-full mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Gerenciamento de Agenda</h1>

      <Card>
        <CardHeader>
          <CardTitle>Horários de Atendimento</CardTitle>
          <CardDescription>
            Configure quais dias e horários você está disponível para atendimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Carregando disponibilidade...</p>
            </div>
          ) : (
            <VisualWeeklySchedule 
              doctorId={doctorId}
              weeklyAvailability={weeklyAvailability}
              onAvailabilityChange={handleAvailabilityChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
