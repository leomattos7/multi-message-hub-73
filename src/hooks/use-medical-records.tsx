
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  doctor_id?: string;
}

interface RecordSummary {
  record_type: string;
  count: number;
}

export const useMedicalRecords = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const navigate = useNavigate();

  const { 
    data: patients, 
    isLoading: patientsLoading, 
    refetch: refetchPatients 
  } = useQuery({
    queryKey: ["patients", searchQuery],
    queryFn: async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("User not authenticated, returning mock data");
          return [];
        }
        
        let query = supabase
          .from("patients")
          .select("id, name, email, phone, address, notes, payment_method, insurance_name, birth_date, biological_sex, gender_identity, doctor_id");
        
        // Filter by current doctor if this is a multi-doctor system
        query = query.eq("doctor_id", user.id);
        
        if (searchQuery) {
          query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
        }
        
        const { data: patientsData, error: patientsError } = await query.order("name");
        
        if (patientsError) {
          console.error("Error fetching patients:", patientsError);
          return [];
        }
        
        // Try to fetch record counts, but catch errors
        const patientsWithRecordCounts = await Promise.all(patientsData.map(async (patient) => {
          try {
            const { count, error: countError } = await supabase
              .from("medical_records")
              .select("*", { count: "exact", head: true })
              .eq("patient_id", patient.id);
              
            if (countError) {
              console.error("Error fetching record count:", countError);
              return { ...patient, record_count: 0 };
            }
            
            return { ...patient, record_count: count || 0 };
          } catch (error) {
            console.error("Error processing record count:", error);
            return { ...patient, record_count: 0 };
          }
        }));
        
        return patientsWithRecordCounts as Patient[];
      } catch (error) {
        console.error("Error in queryFn:", error);
        toast.error("Erro ao carregar pacientes. Usando dados de exemplo.");
        return []; // Return empty array on error
      }
    }
  });

  const { data: recordSummary } = useQuery({
    queryKey: ["record-summary"],
    queryFn: async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          return [];
        }
        
        const { data, error } = await supabase
          .from("medical_records")
          .select("record_type, patient_id");
          
        if (error) {
          console.error("Error fetching record summary:", error);
          return [];
        }
        
        const counts: Record<string, number> = {};
        data?.forEach(record => {
          counts[record.record_type] = (counts[record.record_type] || 0) + 1;
        });
        
        return Object.entries(counts).map(([record_type, count]) => ({
          record_type,
          count
        })) as RecordSummary[];
      } catch (error) {
        console.error("Error fetching record summary:", error);
        return [];
      }
    }
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
