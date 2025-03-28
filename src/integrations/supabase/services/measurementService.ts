
import { supabase } from '../client';
import { Measurement } from '@/types/measurement';

export const measurementService = {
  /**
   * Fetches all measurements for a patient
   */
  async getPatientMeasurements(patientId: string): Promise<Measurement[]> {
    if (!patientId) throw new Error("Patient ID is required");
    
    const { data, error } = await supabase
      .from("medical_records")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data as Measurement[];
  },

  /**
   * Saves a measurement to the database
   */
  async saveMeasurement(
    patientId: string,
    name: string, 
    value: number, 
    unit: string
  ): Promise<boolean> {
    if (!patientId) {
      throw new Error("Patient ID is required");
    }

    if (!name || value === null || value === undefined || isNaN(Number(value))) {
      throw new Error("Name and value are required");
    }

    try {
      // Check if this measurement already exists
      const { data: existingMeasurement, error: fetchError } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", patientId)
        .eq("name", name.toLowerCase())
        .maybeSingle();
      
      if (fetchError) {
        console.error("Error checking existing measurement:", fetchError);
        throw fetchError;
      }
      
      let result;
      
      if (existingMeasurement) {
        // Update existing measurement
        result = await supabase
          .from("medical_records")
          .update({
            value: value,
            unit: unit,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingMeasurement.id);
      } else {
        // Insert new measurement
        result = await supabase
          .from("medical_records")
          .insert([
            {
              patient_id: patientId,
              name: name.toLowerCase(),
              value: value,
              unit: unit,
              record_type: 'measurement',
              content: JSON.stringify({ name, value, unit }),
              record_date: new Date().toISOString(),
            }
          ]);
      }

      if (result.error) {
        console.error("Database operation error:", result.error);
        throw result.error;
      }
      
      return true;
    } catch (error) {
      console.error("Error saving measurement:", error);
      throw error;
    }
  }
};
