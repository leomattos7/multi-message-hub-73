import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiService } from "@/services/api-service";

interface DoctorProfile {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const useDoctorList = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.get<DoctorProfile[]>(
        "/api/doctor_profiles"
      );
      if (data) {
        setDoctors(data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao carregar médicos:", error);
      toast.error("Erro ao carregar lista de médicos");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return {
    doctors,
    isLoading,
    refetchDoctors: fetchDoctors,
  };
};
