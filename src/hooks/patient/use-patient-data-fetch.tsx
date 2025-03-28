
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Patient } from "@/types/patient";

export const usePatientDataFetch = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      
      // Get all patients with the new schema field names
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*');

      if (patientsError) {
        console.error("Error fetching patients:", patientsError);
        toast.error("Erro ao carregar pacientes");
        setIsLoading(false);
        return;
      }

      // Get appointment data for last appointment date
      const { data: consultations } = await supabase
        .from('consultations')
        .select('patient_id, start_time')
        .order('start_time', { ascending: false });

      // Get conversation data for last message
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id, patient_id');

      const { data: messages } = await supabase
        .from('messages')
        .select('conversation_id, created_at')
        .order('created_at', { ascending: false });

      // Process data to get the right format
      if (patientsData) {
        const patientAppointments = new Map();
        if (consultations) {
          consultations.forEach(appointment => {
            if (!patientAppointments.has(appointment.patient_id) || 
                new Date(appointment.start_time) > new Date(patientAppointments.get(appointment.patient_id))) {
              patientAppointments.set(appointment.patient_id, appointment.start_time);
            }
          });
        }

        const patientMessages = new Map();
        const conversationToPatient = new Map();
        if (conversations) {
          conversations.forEach(conversation => {
            conversationToPatient.set(conversation.id, conversation.patient_id);
          });
        }

        if (messages) {
          messages.forEach(message => {
            const patientId = conversationToPatient.get(message.conversation_id);
            if (patientId && (!patientMessages.has(patientId) || 
                new Date(message.created_at) > new Date(patientMessages.get(patientId)))) {
              patientMessages.set(patientId, message.created_at);
            }
          });
        }

        const formattedPatients = patientsData.map(patient => ({
          id: patient.id,
          full_name: patient.full_name,
          name: patient.full_name, // For backwards compatibility
          email: patient.email || "",
          phone: patient.phone || "",
          address: patient.address || "",
          notes: patient.notes || "",
          payment_form: patient.payment_form || "Particular",
          payment_method: patient.payment_form || "Particular", // For backwards compatibility
          insurance_name: "", // No direct field in new schema
          lastMessageDate: patientMessages.has(patient.id) ? new Date(patientMessages.get(patient.id)) : null,
          lastAppointmentDate: patientAppointments.has(patient.id) ? new Date(patientAppointments.get(patient.id)) : null,
          cpf: patient.cpf || "",
          date_of_birth: patient.date_of_birth || "",
          birth_date: patient.date_of_birth || "", // For backwards compatibility
          biological_sex: patient.biological_sex || "Não Informado",
          gender_identity: patient.gender_identity || "Não Informado"
        }));

        setPatients(formattedPatients);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Erro ao carregar pacientes");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    isLoading,
    refetchPatients: fetchPatients
  };
};
