
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
      
      let query;
      
      // Depending on the record type, fetch from the appropriate table
      switch (recordType) {
        case "medication":
        case "medicacao":
          query = supabase
            .from("record_medications")
            .select("*")
            .eq("record_id", patientId);
          break;
        
        case "problema":
          query = supabase
            .from("record_problems")
            .select("*")
            .eq("record_id", patientId);
          break;
          
        case "exames":
          query = supabase
            .from("record_exams")
            .select("*")
            .eq("record_id", patientId);
          break;
          
        case "antecedente_pessoal":
        case "historico_familiar":
        case "today":
        default:
          // For SOAP notes and general records, use consultations table
          query = supabase
            .from("consultations")
            .select("*")
            .eq("patient_id", patientId);
          
          // If specific record type is requested
          if (recordType !== "all" && recordType !== "today") {
            // Add more specific filtering if needed
          }
          break;
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match expected MedicalRecord format
      return data.map(item => {
        return {
          id: item.id,
          patient_id: item.patient_id || item.record_id,
          record_date: item.created_at,
          record_type: recordType === "all" ? determineRecordType(item) : recordType,
          content: formatContent(item, recordType),
          created_at: item.created_at,
          updated_at: item.created_at
        } as MedicalRecord;
      });
    },
    enabled: !!patientId,
  });

  // Helper function to determine record type based on data structure
  const determineRecordType = (item: any): string => {
    if (item.subjective || item.objective || item.assessment || item.plan) {
      return "soap";
    }
    
    if (item.name && item.dosage) {
      return "medicacao";
    }
    
    if (item.name && (item.cid || item.ciap)) {
      return "problema";
    }
    
    return "consultation";
  };
  
  // Format content based on record type
  const formatContent = (item: any, type: string): string => {
    switch (type) {
      case "medicacao":
        return JSON.stringify({
          name: item.name,
          dosage: item.dosage,
          frequency: item.frequency
        });
        
      case "problema":
        return JSON.stringify({
          name: item.name,
          cid: item.cid,
          ciap: item.ciap
        });
        
      case "exames":
        return JSON.stringify({
          name: item.name,
          result: item.result,
          reference_value: item.reference_value,
          is_abnormal: item.is_abnormal,
          date: item.date
        });
        
      case "soap":
      case "consultation":
      default:
        // For SOAP/consultations, use the SOAP format
        if (item.subjective || item.objective || item.assessment || item.plan) {
          return `
**Subjetivo:**
${item.subjective || "Não informado"}

**Objetivo:**
${item.objective || "Não informado"}

**Avaliação:**
${item.assessment || "Não informado"}

**Plano:**
${item.plan || "Não informado"}
          `.trim();
        }
        
        // Generic content (fallback)
        return typeof item.content === 'string' ? item.content : JSON.stringify(item);
    }
  };

  const createRecord = async (content: string, type: string) => {
    if (!patientId || !content.trim()) {
      throw new Error("Patient ID and content are required");
    }

    const currentDate = new Date().toISOString();
    let result;
    
    // Insert into the appropriate table based on type
    switch (type) {
      case "medicacao":
        try {
          const medicationData = JSON.parse(content);
          result = await supabase
            .from("record_medications")
            .insert({
              record_id: patientId,
              name: medicationData.name,
              dosage: medicationData.dosage,
              frequency: medicationData.frequency
            });
        } catch (e) {
          // Fallback for non-JSON content
          result = await supabase
            .from("record_medications")
            .insert({
              record_id: patientId,
              name: content
            });
        }
        break;
        
      case "problema":
        try {
          const problemData = JSON.parse(content);
          result = await supabase
            .from("record_problems")
            .insert({
              record_id: patientId,
              name: problemData.name,
              cid: problemData.cid,
              ciap: problemData.ciap
            });
        } catch (e) {
          // Fallback for non-JSON content
          result = await supabase
            .from("record_problems")
            .insert({
              record_id: patientId,
              name: content
            });
        }
        break;
        
      case "soap":
        // Parse SOAP content
        try {
          // For SOAP notes, try to extract sections
          const subjective = content.includes("**Subjetivo:**") 
            ? content.split("**Subjetivo:**")[1].split("**Objetivo:**")[0].trim()
            : "";
            
          const objective = content.includes("**Objetivo:**") 
            ? content.split("**Objetivo:**")[1].split("**Avaliação:**")[0].trim()
            : "";
            
          const assessment = content.includes("**Avaliação:**") 
            ? content.split("**Avaliação:**")[1].split("**Plano:**")[0].trim()
            : "";
            
          const plan = content.includes("**Plano:**") 
            ? content.split("**Plano:**")[1].trim()
            : "";
            
          result = await supabase
            .from("consultations")
            .insert({
              patient_id: patientId,
              subjective,
              objective,
              assessment,
              plan
            });
        } catch (e) {
          // Fallback - save as a generic consultation
          result = await supabase
            .from("consultations")
            .insert({
              patient_id: patientId,
              subjective: "Consulta registrada",
              plan: content
            });
        }
        break;
        
      case "antecedente_pessoal":
      case "historico_familiar":
      default:
        // For other types, store in consultations as a note
        result = await supabase
          .from("consultations")
          .insert({
            patient_id: patientId,
            subjective: `Registro de ${type}`,
            plan: content
          });
        break;
    }

    const { error } = result;
    if (error) throw error;
    
    await refetchRecords();
    return true;
  };

  const deleteRecord = async (recordId: string) => {
    if (!patientId || !recordId) {
      throw new Error("Patient ID and record ID are required");
    }
    
    // Determine which table to delete from based on the current record type
    let table;
    switch (recordType) {
      case "medicacao":
        table = "record_medications";
        break;
      case "problema":
        table = "record_problems";
        break;
      case "exames":
        table = "record_exams";
        break;
      case "antecedente_pessoal":
      case "historico_familiar":
      case "soap":
      default:
        table = "consultations";
        break;
    }
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", recordId);

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
