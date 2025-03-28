
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/types/patient";

interface RecordSummary {
  total: number;
  lastWeek: number;
  thisMonth: number;
}

export const useMedicalRecords = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [recordSummary, setRecordSummary] = useState<RecordSummary>({
    total: 0,
    lastWeek: 0,
    thisMonth: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchRecordSummary();
  }, []);

  const fetchPatients = async () => {
    try {
      setPatientsLoading(true);
      
      // Get all patients
      const { data: patientsData, error: patientsError } = await supabase
        .from("patients")
        .select("*");

      if (patientsError) throw patientsError;

      // Get record counts per patient
      const { data: recordsData, error: recordsError } = await supabase
        .from("medical_records")
        .select("patient_id");

      if (recordsError) throw recordsError;

      // Calculate record count per patient
      const recordCounts: { [key: string]: number } = {};
      if (recordsData) {
        recordsData.forEach(record => {
          if (record.patient_id) {
            recordCounts[record.patient_id] = (recordCounts[record.patient_id] || 0) + 1;
          }
        });
      }

      // Combine patient data with record counts
      const formattedPatients = patientsData?.map(patient => ({
        ...patient,
        name: patient.full_name,
        birth_date: patient.date_of_birth,
        payment_method: patient.payment_form,
        record_count: recordCounts[patient.id] || 0,
      })) || [];

      setPatients(formattedPatients);
      setPatientsLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatientsLoading(false);
    }
  };

  const fetchRecordSummary = async () => {
    try {
      const { data: recordsData, error: recordsError } = await supabase
        .from("medical_records")
        .select("created_at");

      if (recordsError) throw recordsError;

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const summary = {
        total: recordsData?.length || 0,
        lastWeek: recordsData?.filter(record => new Date(record.created_at) >= oneWeekAgo).length || 0,
        thisMonth: recordsData?.filter(record => new Date(record.created_at) >= firstDayOfMonth).length || 0
      };

      setRecordSummary(summary);
    } catch (error) {
      console.error("Error fetching record summary:", error);
    }
  };

  const refetchPatients = () => {
    fetchPatients();
    fetchRecordSummary();
  };

  const viewPatientRecords = (patient: Patient) => {
    navigate(`/prontuario/${patient.id}`);
  };

  const navigateToNewPatient = (patientId: string) => {
    navigate(`/prontuario/${patientId}`);
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => {
    const searchLower = searchQuery.toLowerCase();
    const nameLower = (patient.full_name || patient.name || '').toLowerCase();
    const emailLower = (patient.email || '').toLowerCase();
    const phoneLower = (patient.phone || '').toLowerCase();
    
    return nameLower.includes(searchLower) || 
           emailLower.includes(searchLower) || 
           phoneLower.includes(searchLower);
  });

  return {
    patients: filteredPatients,
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
