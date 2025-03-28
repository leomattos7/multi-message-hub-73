
import { supabase } from '../client';
import { Patient } from '@/types/patient';

export const patientService = {
  async getPatients() {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('full_name');

      if (error) throw error;

      // Map to our Patient interface with backwards compatibility
      const formattedPatients = data.map(patient => ({
        id: patient.id,
        full_name: patient.full_name,
        name: patient.full_name, // For backwards compatibility
        email: patient.email || "",
        phone: patient.phone || "",
        address: patient.address || "",
        notes: patient.notes || "",
        payment_form: patient.payment_form || "Particular",
        payment_method: patient.payment_form || "Particular", // For backwards compatibility
        cpf: patient.cpf || "",
        date_of_birth: patient.date_of_birth || "",
        birth_date: patient.date_of_birth || "", // For backwards compatibility
        biological_sex: patient.biological_sex || "Não Informado",
        gender_identity: patient.gender_identity || "Não Informado",
        doctor_id: patient.doctor_id || "",
        created_at: patient.created_at || ""
      })) as Patient[];

      return formattedPatients;
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  },

  async getPatientById(id: string) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Map to our Patient interface with backwards compatibility
      const patient: Patient = {
        id: data.id,
        full_name: data.full_name,
        name: data.full_name, // For backwards compatibility
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        notes: data.notes || "",
        payment_form: data.payment_form || "Particular",
        payment_method: data.payment_form || "Particular", // For backwards compatibility
        cpf: data.cpf || "",
        date_of_birth: data.date_of_birth || "",
        birth_date: data.date_of_birth || "", // For backwards compatibility
        biological_sex: data.biological_sex || "Não Informado",
        gender_identity: data.gender_identity || "Não Informado",
        doctor_id: data.doctor_id || "",
        created_at: data.created_at || ""
      };

      return patient;
    } catch (error) {
      console.error("Error fetching patient:", error);
      throw error;
    }
  },

  async createPatient(patientData: {
    full_name: string;
    email?: string;
    phone?: string;
    address?: any;
    notes?: string;
    payment_form?: 'Particular' | 'Convênio';
    cpf?: string;
    date_of_birth?: string;
    biological_sex?: 'Masculino' | 'Feminino' | 'Intersexo' | 'Não Informado';
    gender_identity?: 'Não Informado' | 'Homem' | 'Mulher' | 'Não-Binário' | 'Outro';
    doctor_id?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert({
          full_name: patientData.full_name,
          email: patientData.email || null,
          phone: patientData.phone || null,
          address: patientData.address || null,
          notes: patientData.notes || null,
          payment_form: patientData.payment_form || "Particular",
          cpf: patientData.cpf || null,
          date_of_birth: patientData.date_of_birth || null,
          biological_sex: patientData.biological_sex || null,
          gender_identity: patientData.gender_identity || null,
          doctor_id: patientData.doctor_id || null
        })
        .select()
        .single();

      if (error) throw error;

      // Map to our Patient interface with backwards compatibility
      const patient: Patient = {
        id: data.id,
        full_name: data.full_name,
        name: data.full_name, // For backwards compatibility
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        notes: data.notes || "",
        payment_form: data.payment_form || "Particular",
        payment_method: data.payment_form || "Particular", // For backwards compatibility
        cpf: data.cpf || "",
        date_of_birth: data.date_of_birth || "",
        birth_date: data.date_of_birth || "", // For backwards compatibility
        biological_sex: data.biological_sex || "Não Informado",
        gender_identity: data.gender_identity || "Não Informado",
        doctor_id: data.doctor_id || "",
        created_at: data.created_at || ""
      };

      return patient;
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  },

  async updatePatient(id: string, patientData: {
    full_name?: string;
    email?: string;
    phone?: string;
    address?: any;
    notes?: string;
    payment_form?: 'Particular' | 'Convênio';
    cpf?: string;
    date_of_birth?: string;
    biological_sex?: 'Masculino' | 'Feminino' | 'Intersexo' | 'Não Informado';
    gender_identity?: 'Não Informado' | 'Homem' | 'Mulher' | 'Não-Binário' | 'Outro';
    doctor_id?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update({
          full_name: patientData.full_name,
          email: patientData.email,
          phone: patientData.phone,
          address: patientData.address,
          notes: patientData.notes,
          payment_form: patientData.payment_form,
          cpf: patientData.cpf,
          date_of_birth: patientData.date_of_birth,
          biological_sex: patientData.biological_sex,
          gender_identity: patientData.gender_identity,
          doctor_id: patientData.doctor_id
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Map to our Patient interface with backwards compatibility
      const patient: Patient = {
        id: data.id,
        full_name: data.full_name,
        name: data.full_name, // For backwards compatibility
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        notes: data.notes || "",
        payment_form: data.payment_form || "Particular",
        payment_method: data.payment_form || "Particular", // For backwards compatibility
        cpf: data.cpf || "",
        date_of_birth: data.date_of_birth || "",
        birth_date: data.date_of_birth || "", // For backwards compatibility
        biological_sex: data.biological_sex || "Não Informado",
        gender_identity: data.gender_identity || "Não Informado",
        doctor_id: data.doctor_id || "",
        created_at: data.created_at || ""
      };

      return patient;
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    }
  },

  async deletePatient(id: string) {
    try {
      // First check for conversations and related messages
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('id')
        .eq('patient_id', id);
        
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
            throw deleteMessagesError;
          }
        }
        
        // Then delete conversations
        const { error: deleteConversationsError } = await supabase
          .from('conversations')
          .delete()
          .eq('patient_id', id);
          
        if (deleteConversationsError) {
          console.error("Error deleting conversations:", deleteConversationsError);
          throw deleteConversationsError;
        }
      }
      
      // Delete consultations
      const { error: deleteConsultationsError } = await supabase
        .from('consultations')
        .delete()
        .eq('patient_id', id);
        
      if (deleteConsultationsError) {
        console.error("Error deleting consultations:", deleteConsultationsError);
        throw deleteConsultationsError;
      }
      
      // Finally delete the patient
      const { error: deletePatientError } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);
        
      if (deletePatientError) {
        console.error("Error deleting patient:", deletePatientError);
        throw deletePatientError;
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw error;
    }
  },

  async getPatientConversations(patientId: string) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('patient_id', patientId)
        .order('last_activity', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching patient conversations:", error);
      throw error;
    }
  },

  async getPatientAppointments(patientId: string) {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('patient_id', patientId)
        .order('start_time', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching patient appointments:", error);
      throw error;
    }
  }
};
