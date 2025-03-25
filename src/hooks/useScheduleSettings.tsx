
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TimeBlock } from "@/components/DateTimeBlockSelector";

export interface ConsultationType {
  id?: string;
  name: string;
  duration: number;
  doctor_id: string;
}

export interface WeeklyTimeSlot {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
}

export function useScheduleSettings(doctorId: string) {
  const [blockedTimes, setBlockedTimes] = useState<TimeBlock[]>([]);
  const [weeklyAvailability, setWeeklyAvailability] = useState<WeeklyTimeSlot[]>([]);
  const [consultationTypes, setConsultationTypes] = useState<ConsultationType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("availability");

  useEffect(() => {
    fetchConsultationTypes();
    fetchWeeklyAvailability();
    fetchBlockedTimes();
  }, []);

  const fetchConsultationTypes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('consultation_types')
        .select('*')
        .eq('doctor_id', doctorId);

      if (error) {
        console.error("Error fetching consultation types:", error);
        toast.error("Erro ao carregar tipos de consulta");
      } else if (data) {
        setConsultationTypes(data);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao carregar tipos de consulta");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeeklyAvailability = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('doctor_availability')
        .select('*')
        .eq('doctor_id', doctorId);

      if (error) {
        console.error("Error fetching weekly availability:", error);
        toast.error("Erro ao carregar disponibilidade semanal");
      } else if (data) {
        const transformedData = data.map(slot => ({
          id: slot.id,
          day: slot.day_of_week,
          startTime: slot.start_time,
          endTime: slot.end_time
        }));
        setWeeklyAvailability(transformedData);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao carregar disponibilidade semanal");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlockedTimes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('doctor_id', doctorId)
        .eq('event_type', 'block');

      if (error) {
        console.error("Error fetching blocked times:", error);
        toast.error("Erro ao carregar bloqueios de agenda");
      } else if (data) {
        const transformedData = data.map(block => ({
          id: block.id,
          date: new Date(block.date),
          startTime: block.start_time.substring(0, 5),
          endTime: block.end_time.substring(0, 5)
        }));
        setBlockedTimes(transformedData);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao carregar bloqueios de agenda");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    blockedTimes,
    setBlockedTimes,
    weeklyAvailability,
    setWeeklyAvailability,
    consultationTypes,
    setConsultationTypes,
    isLoading,
    setIsLoading
  };
}
