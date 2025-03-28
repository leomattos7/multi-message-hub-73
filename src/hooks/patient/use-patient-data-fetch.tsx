
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Patient } from "@/types/patient";
import { patientService } from "@/integrations/supabase/services/patientService";

export const usePatientDataFetch = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      
      const patientsData = await patientService.getPatients();
      setPatients(patientsData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Erro ao carregar pacientes");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    isLoading,
    refetchPatients: fetchPatients
  };
};
