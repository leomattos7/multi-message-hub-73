
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Patient } from "@/types/patient";

export const usePatientOperations = (
  patients: Patient[], 
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>,
  selectedPatient: Patient | null,
  setSelectedPatient: React.Dispatch<React.SetStateAction<Patient | null>>,
  setIsAddPatientOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEditPatientOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  patientToDelete: Patient | null,
  setPatientToDelete: React.Dispatch<React.SetStateAction<Patient | null>>
) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddPatient = async (newPatient: any) => {
    if (!newPatient.name) {
      toast.error("Por favor, preencha o nome do contato");
      return;
    }

    try {
      setIsProcessing(true);
      const { data, error } = await supabase
        .from('patients')
        .insert({
          full_name: newPatient.name,
          email: newPatient.email || null,
          phone: newPatient.phone || null,
          address: newPatient.address || null,
          notes: newPatient.notes || null,
          payment_form: newPatient.payment_method || "Particular",
          cpf: newPatient.cpf || null,
          date_of_birth: newPatient.birth_date || null,
          biological_sex: newPatient.biological_sex || null,
          gender_identity: newPatient.gender_identity || null
        })
        .select();
        
      if (error) {
        console.error("Error inserting patient in Supabase:", error);
        toast.error("Erro ao adicionar paciente. Por favor, tente novamente.");
        setIsProcessing(false);
        return;
      }
      
      if (data && data.length > 0) {
        const newPatientObj: Patient = {
          id: data[0].id,
          full_name: data[0].full_name,
          name: data[0].full_name, // For backwards compatibility
          email: data[0].email || "",
          phone: data[0].phone || "",
          address: data[0].address || "",
          notes: data[0].notes || "",
          payment_form: data[0].payment_form || "Particular",
          payment_method: data[0].payment_form || "Particular", // For backwards compatibility
          insurance_name: "",
          lastMessageDate: null,
          lastAppointmentDate: null,
          cpf: data[0].cpf || "",
          date_of_birth: data[0].date_of_birth || "",
          birth_date: data[0].date_of_birth || "", // For backwards compatibility
          biological_sex: data[0].biological_sex || "Não Informado",
          gender_identity: data[0].gender_identity || "Não Informado"
        };

        setPatients([...patients, newPatientObj]);
        setIsAddPatientOpen(false);
        toast.success("Paciente adicionado com sucesso!");
      }
      setIsProcessing(false);
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Erro ao adicionar paciente. Por favor, tente novamente.");
      setIsProcessing(false);
    }
  };

  const handleUpdatePatient = async (editingPatient: any) => {
    if (!editingPatient.name) {
      toast.error("Por favor, preencha o nome do contato");
      return;
    }

    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('patients')
        .update({
          full_name: editingPatient.name,
          email: editingPatient.email || null,
          phone: editingPatient.phone || null,
          address: editingPatient.address || null,
          notes: editingPatient.notes || null,
          payment_form: editingPatient.payment_method || "Particular",
          cpf: editingPatient.cpf || null,
          date_of_birth: editingPatient.birth_date || null,
          biological_sex: editingPatient.biological_sex || "Não Informado",
          gender_identity: editingPatient.gender_identity || "Não Informado"
        })
        .eq('id', editingPatient.id);
        
      if (error) {
        console.error("Error updating patient in Supabase:", error);
        toast.error("Erro ao atualizar contato. Por favor, tente novamente.");
        setIsProcessing(false);
        return;
      }
      
      const updatedPatients = patients.map(patient => {
        if (patient.id === editingPatient.id) {
          return {
            ...patient,
            full_name: editingPatient.name,
            name: editingPatient.name, // For backwards compatibility
            email: editingPatient.email,
            phone: editingPatient.phone,
            address: editingPatient.address,
            notes: editingPatient.notes,
            payment_form: editingPatient.payment_method,
            payment_method: editingPatient.payment_method, // For backwards compatibility
            insurance_name: editingPatient.payment_method === "convenio" ? editingPatient.insurance_name : "",
            cpf: editingPatient.cpf,
            date_of_birth: editingPatient.birth_date,
            birth_date: editingPatient.birth_date, // For backwards compatibility
            biological_sex: editingPatient.biological_sex,
            gender_identity: editingPatient.gender_identity
          };
        }
        return patient;
      });
      
      setPatients(updatedPatients);
      
      if (selectedPatient && selectedPatient.id === editingPatient.id) {
        setSelectedPatient({
          ...selectedPatient,
          full_name: editingPatient.name,
          name: editingPatient.name, // For backwards compatibility
          email: editingPatient.email,
          phone: editingPatient.phone,
          address: editingPatient.address,
          notes: editingPatient.notes,
          payment_form: editingPatient.payment_method,
          payment_method: editingPatient.payment_method, // For backwards compatibility
          insurance_name: editingPatient.payment_method === "convenio" ? editingPatient.insurance_name : "",
          cpf: editingPatient.cpf,
          date_of_birth: editingPatient.birth_date,
          birth_date: editingPatient.birth_date, // For backwards compatibility
          biological_sex: editingPatient.biological_sex,
          gender_identity: editingPatient.gender_identity
        });
      }
      
      setIsEditPatientOpen(false);
      toast.success("Contato atualizado com sucesso!");
      setIsProcessing(false);
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Erro ao atualizar contato. Por favor, tente novamente.");
      setIsProcessing(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
    
    try {
      setIsProcessing(true);
      // First check for conversations and related messages
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('id')
        .eq('patient_id', patientToDelete.id);
        
      if (conversationsError) {
        console.error("Error fetching conversations:", conversationsError);
      } else if (conversations && conversations.length > 0) {
        // Delete messages for each conversation
        for (const conversation of conversations) {
          const { error: deleteMessagesError } = await supabase
            .from('messages')
            .delete()
            .eq('conversation_id', conversation.id);
            
          if (deleteMessagesError) {
            console.error("Error deleting messages:", deleteMessagesError);
            toast.error("Erro ao excluir mensagens relacionadas.");
            setIsProcessing(false);
            return;
          }
        }
        
        // Then delete conversations
        const { error: deleteConversationsError } = await supabase
          .from('conversations')
          .delete()
          .eq('patient_id', patientToDelete.id);
          
        if (deleteConversationsError) {
          console.error("Error deleting conversations:", deleteConversationsError);
          toast.error("Erro ao excluir conversas relacionadas.");
          setIsProcessing(false);
          return;
        }
      }
      
      // Delete consultations
      const { error: deleteConsultationsError } = await supabase
        .from('consultations')
        .delete()
        .eq('patient_id', patientToDelete.id);
        
      if (deleteConsultationsError) {
        console.error("Error deleting consultations:", deleteConsultationsError);
        toast.error("Erro ao excluir consultas relacionadas.");
        setIsProcessing(false);
        return;
      }
      
      // Finally delete the patient
      const { error: deletePatientError } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientToDelete.id);
        
      if (deletePatientError) {
        console.error("Error deleting patient:", deletePatientError);
        toast.error("Erro ao excluir contato. Tente novamente.");
        setIsProcessing(false);
        return;
      }
      
      // Update local state
      const updatedPatients = patients.filter(p => p.id !== patientToDelete.id);
      setPatients(updatedPatients);
      
      if (selectedPatient && selectedPatient.id === patientToDelete.id) {
        setSelectedPatient(null);
      }
      
      setIsDeleteDialogOpen(false);
      setPatientToDelete(null);
      toast.success("Contato excluído com sucesso!");
      setIsProcessing(false);
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error("Erro ao excluir contato. Por favor, tente novamente.");
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleAddPatient,
    handleUpdatePatient,
    handleDeletePatient
  };
};
