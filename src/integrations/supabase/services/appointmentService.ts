
import { supabase } from '../client';
import { format } from 'date-fns';

export interface Appointment {
  id: string;
  patient_id: string;
  start_time: string;
  end_time: string;
  status: 'aguardando' | 'confirmado' | 'cancelado';
  payment_method?: 'Particular' | 'Convênio';
  notes?: string;
  type?: string;
  consultation_type_id?: string;
  doctor_id?: string;
  patient?: {
    full_name: string;
    email?: string;
    phone?: string;
  };
}

export const appointmentService = {
  async getAppointments(date?: Date) {
    try {
      // Use consultations instead of appointments based on the database schema
      let query = supabase
        .from("consultations")
        .select(`
          id,
          patient_id,
          start_time,
          end_time,
          status,
          payment_method,
          subjective as notes,
          consultation_type_id,
          doctor_id,
          patients(full_name, email, phone)
        `);

      // If date is provided, filter by that date
      if (date) {
        const formattedDate = format(date, "yyyy-MM-dd");
        // Filter based on start_time (date component)
        query = query.gte('start_time', `${formattedDate}T00:00:00`)
                     .lt('start_time', `${formattedDate}T23:59:59`);
      }

      const { data, error } = await query.order("start_time");
      
      if (error) throw error;
      
      // Map to our Appointment interface
      return data.map(item => ({
        id: item.id,
        patient_id: item.patient_id,
        start_time: item.start_time,
        end_time: item.end_time,
        status: item.status,
        payment_method: item.payment_method,
        notes: item.notes,
        consultation_type_id: item.consultation_type_id,
        doctor_id: item.doctor_id,
        patient: item.patients
      })) as Appointment[];
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  },
  
  async createAppointment(appointment: {
    patient_id: string;
    start_time: string;
    end_time: string;
    status: 'aguardando' | 'confirmado' | 'cancelado';
    payment_method?: 'Particular' | 'Convênio';
    notes?: string;
    consultation_type_id?: string;
    doctor_id?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from("consultations")
        .insert({
          patient_id: appointment.patient_id,
          start_time: appointment.start_time,
          end_time: appointment.end_time,
          status: appointment.status,
          payment_method: appointment.payment_method,
          subjective: appointment.notes,
          consultation_type_id: appointment.consultation_type_id,
          doctor_id: appointment.doctor_id
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },
  
  async updateAppointment(id: string, updates: {
    patient_id?: string;
    start_time?: string;
    end_time?: string;
    status?: 'aguardando' | 'confirmado' | 'cancelado';
    payment_method?: 'Particular' | 'Convênio';
    notes?: string;
    consultation_type_id?: string;
    doctor_id?: string;
  }) {
    try {
      // Map to database columns
      const dbUpdates: any = {};
      if (updates.patient_id) dbUpdates.patient_id = updates.patient_id;
      if (updates.start_time) dbUpdates.start_time = updates.start_time;
      if (updates.end_time) dbUpdates.end_time = updates.end_time;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.payment_method) dbUpdates.payment_method = updates.payment_method;
      if (updates.notes) dbUpdates.subjective = updates.notes;
      if (updates.consultation_type_id) dbUpdates.consultation_type_id = updates.consultation_type_id;
      if (updates.doctor_id) dbUpdates.doctor_id = updates.doctor_id;
      
      const { data, error } = await supabase
        .from("consultations")
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
  },
  
  async cancelAppointment(id: string) {
    try {
      const { error } = await supabase
        .from("consultations")
        .update({ status: "cancelado" })
        .eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error canceling appointment:", error);
      throw error;
    }
  },
  
  async deleteAppointment(id: string) {
    try {
      const { error } = await supabase
        .from("consultations")
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error deleting appointment:", error);
      throw error;
    }
  }
};
