
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  payment_method?: string;
  insurance_name?: string;
  record_count?: number;
  birth_date?: string;
  biological_sex?: string;
  gender_identity?: string;
  cpf?: string;
}

interface RecordSummary {
  record_type: string;
  count: number;
}

export const useMedicalRecords = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get current user
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const doctorId = user?.id;

  const { 
    data: patients, 
    isLoading: patientsLoading, 
    refetch: refetchPatients 
  } = useQuery({
    queryKey: ["patients", searchQuery, doctorId],
    queryFn: async () => {
      let query = supabase
        .from("patients")
        .select("id, name, email, phone, address, notes, payment_method, insurance_name, birth_date, biological_sex, gender_identity")
        .eq("doctor_id", doctorId);
      
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
      }
      
      const { data: patientsData, error: patientsError } = await query.order("name");
      
      if (patientsError) {
        console.error("Error fetching patients:", patientsError);
        throw patientsError;
      }
      
      const patientsWithRecordCounts = await Promise.all(patientsData.map(async (patient) => {
        const { count, error: countError } = await supabase
          .from("patient_records")
          .select("*", { count: "exact", head: true })
          .eq("patient_id", patient.id);
          
        if (countError) {
          console.error("Error fetching record count:", countError);
          return { ...patient, record_count: 0 };
        }
        
        return { ...patient, record_count: count || 0 };
      }));
      
      return patientsWithRecordCounts as Patient[];
    },
    enabled: !!doctorId
  });

  const { data: recordSummary } = useQuery({
    queryKey: ["record-summary", doctorId],
    queryFn: async () => {
      // First get all patients for this doctor
      const { data: doctorPatients, error: patientError } = await supabase
        .from("patients")
        .select("id")
        .eq("doctor_id", doctorId);
        
      if (patientError) {
        console.error("Error fetching doctor patients:", patientError);
        throw patientError;
      }
      
      // Use the patient IDs to filter records
      const patientIds = doctorPatients.map(p => p.id);
      
      if (patientIds.length === 0) {
        return [];
      }
      
      const { data, error } = await supabase
        .from("patient_records")
        .select("record_type")
        .in("patient_id", patientIds);
        
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data.forEach(record => {
        counts[record.record_type] = (counts[record.record_type] || 0) + 1;
      });
      
      return Object.entries(counts).map(([record_type, count]) => ({
        record_type,
        count
      })) as RecordSummary[];
    },
    enabled: !!doctorId
  });

  const viewPatientRecords = (patient: Patient) => {
    navigate(`/prontuarios/paciente/${patient.id}`);
  };

  const navigateToNewPatient = (patientId: string) => {
    navigate(`/prontuarios/paciente/${patientId}`);
  };

  return {
    patients,
    patientsLoading,
    recordSummary,
    searchQuery,
    setSearchQuery,
    isAddPatientOpen,
    setIsAddPatientOpen,
    refetchPatients,
    viewPatientRecords,
    navigateToNewPatient
  };
};
