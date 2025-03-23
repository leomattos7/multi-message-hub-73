
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MedicalRecord } from "@/types/patient";

export const usePatientRecordsData = (patientId?: string, recordType: string = "all") => {
  const { 
    data: records, 
    isLoading: recordsLoading, 
    refetch: refetchRecords 
  } = useQuery({
    queryKey: ["patient-records", patientId, recordType],
    queryFn: async () => {
      if (!patientId) throw new Error("Patient ID is required");
      
      let query = supabase
        .from("patient_records")
        .select("*")
        .eq("patient_id", patientId);

      if (recordType !== "all") {
        query = query.eq("record_type", recordType);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      
      return data as MedicalRecord[];
    },
    enabled: !!patientId,
  });

  const createRecord = async (content: string, type: string) => {
    if (!patientId || !content.trim()) {
      throw new Error("Patient ID and content are required");
    }

    const currentDate = new Date().toISOString();
    
    const { error } = await supabase
      .from("patient_records")
      .insert({
        patient_id: patientId,
        record_date: currentDate,
        record_type: type,
        content: content,
      });

    if (error) throw error;
    
    await refetchRecords();
    return true;
  };

  const deleteRecord = async (recordId: string) => {
    if (!patientId || !recordId) {
      throw new Error("Patient ID and record ID are required");
    }
    
    const { error } = await supabase
      .from("patient_records")
      .delete()
      .eq("id", recordId)
      .eq("patient_id", patientId);

    if (error) throw error;
    
    await refetchRecords();
    return true;
  };

  return {
    records,
    recordsLoading,
    refetchRecords,
    createRecord,
    deleteRecord
  };
};
