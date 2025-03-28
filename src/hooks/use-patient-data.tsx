
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
      
      // Transform to match the expected Patient interface
      return {
        ...data,
        // Map fields for backward compatibility
        name: data.full_name,
        birth_date: data.date_of_birth,
        payment_method: data.payment_form,
        insurance_name: ""  // No direct equivalent in new schema
      } as Patient;
    },
    enabled: !!patientId
  });

  const updatePatient = async (updatedPatient: Patient) => {
    if (!patientId || !updatedPatient || !(updatedPatient.full_name || updatedPatient.name).trim()) {
      throw new Error("Patient ID and name are required");
    }

    const { error } = await supabase
      .from("patients")
      .update({
        full_name: updatedPatient.name || updatedPatient.full_name,
        email: updatedPatient.email || null,
        phone: updatedPatient.phone || null,
        address: updatedPatient.address || null,
        notes: updatedPatient.notes || null,
        date_of_birth: updatedPatient.birth_date || updatedPatient.date_of_birth || null,
        biological_sex: updatedPatient.biological_sex as "Masculino" | "Feminino" | "Intersexo" | "Não Informado" || null,
        gender_identity: updatedPatient.gender_identity as "Não Informado" | "Homem" | "Mulher" | "Não-Binário" | "Outro" || null,
        cpf: updatedPatient.cpf || null,
        payment_form: updatedPatient.payment_method || updatedPatient.payment_form as "Particular" | "Convênio" || null
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
