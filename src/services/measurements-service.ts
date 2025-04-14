
import { Measurement } from "@/types/measurement";
import { toast } from "sonner";
import { apiService } from "./api-service";

/**
 * Fetches all measurements for a patient
 */
export const fetchPatientMeasurements = async (patientId: string, userId?: string): Promise<Measurement[]> => {
  if (!patientId) throw new Error("Patient ID is required");
  
  try {
    return await apiService.get<Measurement[]>(`/measurements`, userId, { patientId });
  } catch (error) {
    console.error("Error fetching measurements:", error);
    throw error;
  }
};

/**
 * Saves a measurement to the database
 */
export const saveMeasurement = async (
  patientId: string,
  name: string, 
  value: number, 
  unit: string,
  userId?: string
): Promise<boolean> => {
  if (!patientId) {
    toast.error("ID do paciente não encontrado");
    return false;
  }

  if (!name || value === null || value === undefined || isNaN(Number(value))) {
    toast.error("Nome e valor são obrigatórios");
    return false;
  }

  try {
    // Send the measurement to the Lambda API
    await apiService.post('/measurements', {
      patient_id: patientId,
      name: name.toLowerCase(),
      value: Number(value),
      unit: unit,
      date: new Date().toISOString()
    }, userId);
    
    toast.success("Medição salva com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao salvar medição:", error);
    toast.error("Não foi possível salvar a medição");
    return false;
  }
};
