import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiService } from "@/services/api-service";
import { Patient } from "@/types/patient";

export const usePatientsByDoctor = (doctorId: string | null) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPatientsByDoctor = async () => {
    if (!doctorId) {
      setPatients([]);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Buscando pacientes para o médico:", doctorId);

      // Usando o endpoint correto para buscar pacientes por médico
      const data = await apiService.get<Patient[]>(
        `/api/patients?doctor_id=${doctorId}`
      );

      console.log("Pacientes encontrados:", data);

      if (data) {
        // Filtrar apenas os pacientes do médico selecionado
        const filteredPatients = data.filter(
          (patient) => patient.doctor_id === doctorId
        );
        setPatients(filteredPatients);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao carregar pacientes do médico:", error);
      toast.error("Erro ao carregar lista de pacientes");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientsByDoctor();
  }, [doctorId]);

  return {
    patients,
    isLoading,
    refetchPatients: fetchPatientsByDoctor,
  };
};
