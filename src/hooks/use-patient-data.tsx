import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/types/patient";
import { apiService } from "@/services/api-service";

export const usePatientData = (patientId?: string) => {
  const { 
    data: patient, 
    isLoading: patientLoading, 
    refetch: refetchPatient 
  } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      if (!patientId) throw new Error("Patient ID is required");
      
      // Get current user for auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const patientData = await apiService.get<Patient>(`/patients/${patientId}`, user.id);
      
      if (!patientData) throw new Error("Patient not found");
      return patientData;
    },
    enabled: !!patientId
  });

  const updatePatient = async (updatedPatient: Patient) => {
    if (!patientId || !updatedPatient || !updatedPatient.name.trim()) {
      throw new Error("Patient ID and name are required");
    }

    // Get current user for auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    await apiService.put(`/patients/${patientId}`, updatedPatient, user.id);
    await refetchPatient();
    return true;
  };

  return {
    patient,
    patientLoading,
    refetchPatient,
    updatePatient
  };
};
