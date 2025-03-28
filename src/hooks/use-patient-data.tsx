
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/types/patient";

export const usePatientData = (patientId?: string) => {
  const { 
    data: patient, 
    isLoading: patientLoading, 
    refetch: refetchPatient 
  } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      if (!patientId) throw new Error("Patient ID is required");
      
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single();
      
      if (error) throw error;
      return data as Patient;
    },
    enabled: !!patientId
  });

  const updatePatient = async (updatedPatient: Patient) => {
    if (!patientId || !updatedPatient || !updatedPatient.name.trim()) {
      throw new Error("Patient ID and name are required");
    }

    const { error } = await supabase
      .from("patients")
      .update({
        name: updatedPatient.name,
        email: updatedPatient.email || null,
        phone: updatedPatient.phone || null,
        address: updatedPatient.address || null,
        notes: updatedPatient.notes || null,
        birth_date: updatedPatient.birth_date || null,
        biological_sex: updatedPatient.biological_sex || null,
        gender_identity: updatedPatient.gender_identity || null,
        cpf: updatedPatient.cpf || null
      })
      .eq("id", patientId);

    if (error) throw error;
    
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
