
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { SectionType } from "@/hooks/use-collapsible-sections";

interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  birth_date?: string;
  biological_sex?: string;
  gender_identity?: string;
}

interface MedicalRecord {
  id: string;
  patient_id: string;
  record_date: string;
  record_type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const usePatientRecords = (patientId?: string) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [editPatientData, setEditPatientData] = useState<Patient | null>(null);

  const { data: patient, isLoading: patientLoading, refetch: refetchPatient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      if (!patientId) throw new Error("Patient ID is required");
      
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single();
      
      if (error) throw error;
      return data as Patient;
    },
    enabled: !!patientId
  });

  const { data: records, isLoading: recordsLoading, refetch: refetchRecords } = useQuery({
    queryKey: ["patient-records", patientId, activeTab],
    queryFn: async () => {
      if (!patientId) throw new Error("Patient ID is required");
      
      let query = supabase
        .from("patient_records")
        .select("*")
        .eq("patient_id", patientId);

      if (activeTab !== "all") {
        query = query.eq("record_type", activeTab);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      
      return data as MedicalRecord[];
    },
    enabled: !!patientId,
  });

  const handleEditPatient = () => {
    if (patient) {
      setEditPatientData({ ...patient });
      setIsEditPatientOpen(true);
    }
  };

  const createNewRecord = async (content: string, type: string) => {
    if (!patientId || !content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
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

      toast({
        title: "Prontuário criado",
        description: "O prontuário foi criado com sucesso.",
      });
      
      setIsNewRecordOpen(false);
      refetchRecords();
    } catch (error) {
      console.error("Error creating record:", error);
      toast({
        title: "Erro ao criar prontuário",
        description: "Houve um erro ao criar o prontuário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const updatePatient = async (updatedPatient: Patient) => {
    if (!patientId || !updatedPatient || !updatedPatient.name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome do paciente é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("patients")
        .update({
          name: updatedPatient.name,
          email: updatedPatient.email || null,
          phone: updatedPatient.phone || null,
          address: updatedPatient.address || null,
          notes: updatedPatient.notes || null,
          birth_date: updatedPatient.birth_date || null,
          biological_sex: updatedPatient.biological_sex || null,
          gender_identity: updatedPatient.gender_identity || null
        })
        .eq("id", patientId);

      if (error) throw error;

      toast({
        title: "Paciente atualizado",
        description: "Os dados do paciente foram atualizados com sucesso.",
      });

      setIsEditPatientOpen(false);
      refetchPatient();
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Erro ao atualizar paciente",
        description: "Houve um erro ao atualizar os dados do paciente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const renderSectionContent = (sectionId: SectionType) => {
    switch (sectionId) {
      case "medicacoes":
        return <p>Lista de medicações prescritas anteriormente</p>;
      case "problemas":
        return <p>Lista de problemas e diagnósticos do paciente</p>;
      case "exames":
        return <p>Resultados dos últimos exames realizados</p>;
      case "medicacoes_atuais":
        return <p>Medicações em uso atual pelo paciente</p>;
      case "antecedente_pessoal":
        return <p>Histórico médico pessoal do paciente</p>;
      case "historico_familiar":
        return <p>Doenças e condições presentes na família do paciente</p>;
      default:
        return <p>Informações não disponíveis</p>;
    }
  };

  return {
    patient,
    records,
    patientLoading,
    recordsLoading,
    activeTab,
    setActiveTab,
    isNewRecordOpen,
    setIsNewRecordOpen,
    isEditPatientOpen,
    setIsEditPatientOpen,
    editPatientData,
    setEditPatientData,
    handleEditPatient,
    createNewRecord,
    updatePatient,
    renderSectionContent
  };
};
