
import { useQuery } from "@tanstack/react-query";
import { Patient } from "@/types/patient";
import { patientService } from "@/integrations/supabase/services/patientService";

export const usePatientData = (patientId?: string) => {
  const { 
    data: patient, 
    isLoading: patientLoading, 
    refetch: refetchPatient 
  } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      if (!patientId) throw new Error("Patient ID is required");
      return await patientService.getPatientById(patientId);
    },
    enabled: !!patientId
  });

  const updatePatient = async (updatedPatient: Patient) => {
    if (!patientId || !updatedPatient || !(updatedPatient.full_name || updatedPatient.name).trim()) {
      throw new Error("Patient ID and name are required");
    }

    await patientService.updatePatient(patientId, {
      full_name: updatedPatient.full_name || updatedPatient.name || "",
      email: updatedPatient.email,
      phone: updatedPatient.phone,
      address: updatedPatient.address,
      notes: updatedPatient.notes,
      payment_form: updatedPatient.payment_form as 'Particular' | 'Convênio' || updatedPatient.payment_method as 'Particular' | 'Convênio',
      date_of_birth: updatedPatient.date_of_birth || updatedPatient.birth_date,
      biological_sex: updatedPatient.biological_sex as 'Masculino' | 'Feminino' | 'Intersexo' | 'Não Informado',
      gender_identity: updatedPatient.gender_identity as 'Não Informado' | 'Homem' | 'Mulher' | 'Não-Binário' | 'Outro',
      cpf: updatedPatient.cpf
    });
    
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
