
import { supabase } from "@/integrations/supabase/client";
import { Measurement } from "@/types/measurement";
import { toast } from "@/components/ui/use-toast";

/**
 * Fetches all measurements for a patient
 */
export const fetchPatientMeasurements = async (patientId: string): Promise<Measurement[]> => {
  if (!patientId) throw new Error("Patient ID is required");
  
  const { data, error } = await supabase
    .from("measurements")
    .select("*")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data as Measurement[];
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
    const { error } = await supabase
      .from("measurements")
      .upsert([
        {
          patient_id: patientId,
          name: name.toLowerCase(),
          value: value,
          unit: unit,
          date: new Date().toISOString(),
        }
      ], {
        onConflict: 'patient_id,name'
      });

    if (error) throw error;
    
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
