
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VisualWeeklySchedule } from "@/components/VisualWeeklySchedule";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { DoctorProfile } from "@/components/DoctorProfile/types";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState("schedule");
  
  // Initialize the doctor ID (in a real app, this would come from authentication)
  const doctorId = "00000000-0000-0000-0000-000000000000"; // Placeholder

  // Initial doctor profile (same as in Appointments.tsx)
  const initialDoctorProfile: DoctorProfile = {
    id: doctorId,
    name: "Dra. Ana Silva",
    specialty: "Clínico Geral",
    bio: "Médica com mais de 10 anos de experiência em clínica geral, especializada em saúde preventiva e bem-estar.",
    profile_image_url: "https://randomuser.me/api/portraits/women/68.jpg",
    address: "Av. Paulista, 1000, São Paulo - SP",
    phone: "(11) 95555-5555",
    email: "dra.anasilva@clinica.com.br",
    consultationDuration: "30",
    followUpDuration: "20",
    urgentDuration: "15",
    public_url_slug: "dra-ana-silva",
    theme: "default",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // State for doctor profile
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>(initialDoctorProfile);

  // Fetch doctor profile from local storage if available
  useEffect(() => {
    const storedProfile = localStorage.getItem('doctorProfile');
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        setDoctorProfile(parsedProfile);
      } catch (error) {
        console.error("Error parsing doctor profile:", error);
      }
    }
  }, []);

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

  // Handle updating doctor profile
  const handleProfileUpdate = (updatedProfile: DoctorProfile) => {
    setDoctorProfile(updatedProfile);
  };

  return (
    <div className="container max-w-full mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Gerenciamento de Agenda</h1>

      <Tabs defaultValue="schedule" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="schedule">Horários de Atendimento</TabsTrigger>
          <TabsTrigger value="profile">Perfil Profissional</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule">
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
        </TabsContent>
        
        <TabsContent value="profile">
          <ProfileEditForm 
            doctorId={doctorId}
            initialProfile={doctorProfile}
            onProfileUpdate={handleProfileUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
