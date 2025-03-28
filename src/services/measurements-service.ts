
import { Measurement } from "@/types/measurement";
import { measurementService } from "@/integrations/supabase/services/measurementService";
import { toast } from "@/components/ui/use-toast";

/**
 * Fetches all measurements for a patient
 */
export const fetchPatientMeasurements = async (patientId: string): Promise<Measurement[]> => {
  return measurementService.getPatientMeasurements(patientId);
};

/**
 * Saves a measurement to the database
 */
export const saveMeasurement = async (
  patientId: string,
  name: string, 
  value: number, 
  unit: string
): Promise<boolean> => {
  if (!patientId) {
    toast({
      title: "Erro",
      description: "ID do paciente não encontrado",
      variant: "destructive",
    });
    return false;
  }

  if (!name || value === null || value === undefined || isNaN(Number(value))) {
    toast({
      title: "Erro",
      description: "Nome e valor são obrigatórios",
      variant: "destructive",
    });
    return false;
  }

  try {
    await measurementService.saveMeasurement(patientId, name, value, unit);
    
    toast({
      title: "Sucesso",
      description: "Medição salva com sucesso",
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar medição:", error);
    toast({
      title: "Erro",
      description: "Não foi possível salvar a medição",
      variant: "destructive",
    });
    return false;
  }
};
