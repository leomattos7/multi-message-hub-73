import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiService } from "@/services/api-service";

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

interface PatientRecord {
  id: string;
  patient_id: string;
  record_type: string;
  content: string;
  created_at: string;
  updated_at?: string;
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('Usuário não autenticado');
        }

        // Get user profile to get organization_id
        const profileResponse = await apiService.get('/profiles', user.id, {
          filters: JSON.stringify([{
            attribute: 'id',
            operator: '=',
            value: user.id
          }])
        });

        console.log("Profile:", profileResponse);

        if (!profileResponse || !profileResponse[0]?.organization_id) {
          throw new Error('Usuário não está vinculado a uma organização');
        }

        const organizationId = profileResponse[0].organization_id;

        // Fetch patients with doctor_id filter
        const response = await apiService.get<Patient[]>('/patients', user.id, {
          filters: JSON.stringify([{
            attribute: 'doctor_id',
            operator: '=',
            value: organizationId
          }])
        });

        // Format patients data
        const formattedPatients = response.map(patient => ({
          ...patient,
          email: patient.email || "",
          phone: patient.phone || "",
          address: patient.address || "",
          notes: patient.notes || "",
          payment_method: patient.payment_method || "particular",
          insurance_name: patient.insurance_name || "",
          lastMessageDate: null,
          lastAppointmentDate: null,
          cpf: patient.cpf || "",
          birth_date: patient.birth_date || "",
          biological_sex: patient.biological_sex || "",
          gender_identity: patient.gender_identity || ""
        }));

        return formattedPatients;
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Erro ao carregar pacientes');
        return [];
      }
    }
  });

  // Get record summary from API
  const { data: recordSummary = [] } = useQuery({
    queryKey: ["recordSummary"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];
        
        const summary = await apiService.get<RecordSummary[]>("/patient-records/summary");
        return summary || [];
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

  const addPatient = async (patientData: Patient) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Get user profile to get organization_id
      const profileResponse = await apiService.get('/profiles', user.id, {
        filters: JSON.stringify([{
          attribute: 'id',
          operator: '=',
          value: user.id
        }])
      });

      if (!profileResponse || !profileResponse[0]?.organization_id) {
        throw new Error('Usuário não está vinculado a uma organização');
      }

      const organizationId = profileResponse[0].organization_id;

      // Prepare patient data according to the database schema
      const patientWithDoctor = {
        name: patientData.name,
        email: patientData.email || null,
        phone: patientData.phone || null,
        address: patientData.address || null,
        avatar_url: null, // Optional field
        notes: patientData.notes || null,
        doctor_id: organizationId,
        payment_method: patientData.payment_method || null,
        insurance_name: patientData.insurance_name || null,
        birth_date: patientData.birth_date || null,
        biological_sex: patientData.biological_sex || null,
        gender_identity: patientData.gender_identity || null,
        cpf: patientData.cpf || null
      };

      await apiService.post('/patients', patientWithDoctor, user.id);
      await refetchPatients();
      toast.success('Paciente adicionado com sucesso');
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Erro ao adicionar paciente');
    }
  };

  return {
    patients: patients || [],
    patientsLoading,
    recordSummary: recordSummary || [],
    searchQuery,
    setSearchQuery,
    isAddPatientOpen,
    setIsAddPatientOpen,
    refetchPatients,
    viewPatientRecords,
    navigateToNewPatient,
    addPatient
  };
};
