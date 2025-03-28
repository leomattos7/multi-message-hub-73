
import { supabase, generateUUID } from "../client";

export interface Appointment {
  id: string;
  patient_id: string;
  start_time: string;
  end_time: string;
  status: "aguardando" | "confirmado" | "cancelado";
  payment_method?: "Particular" | "Convênio";
  notes?: string;
  consultation_type_id?: string;
  doctor_id: string;
  date: string; // Date in YYYY-MM-DD format
  time: string; // Time in HH:MM format
  patient?: {
    full_name: string;
    email?: string;
    phone?: string;
  };
}

export const appointmentService = {
  /**
   * Gets appointments for a specific date or all appointments if no date is provided
   */
  async getAppointments(date?: Date): Promise<Appointment[]> {
    try {
      let query = supabase
        .from("consultations")
        .select(`
          id,
          patient_id,
          start_time,
          end_time,
          status,
          payment_method,
          notes,
          consultation_type_id,
          doctor_id,
          patients(full_name, email, phone)
        `);

      // If date is provided, filter by that date
      if (date) {
        const dateString = date.toISOString().split('T')[0];
        query = query.eq('date', dateString);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching appointments:", error);
        throw error;
      }

      // Transform the data into our Appointment type format
      return (data || []).map(item => {
        // Extract date and time from start_time
        const startDateTime = new Date(item.start_time);
        const date = startDateTime.toISOString().split('T')[0];
        const time = startDateTime.toTimeString().split(' ')[0].substring(0, 5);

        return {
          id: item.id,
          patient_id: item.patient_id,
          start_time: item.start_time,
          end_time: item.end_time,
          status: item.status,
          payment_method: item.payment_method,
          notes: item.notes,
          consultation_type_id: item.consultation_type_id,
          doctor_id: item.doctor_id,
          date,
          time,
          patient: item.patients
        };
      });
    } catch (error) {
      console.error("Failed to get appointments:", error);
      return [];
    }
  },

  /**
   * Creates a new appointment
   */
  async createAppointment(appointmentData: Omit<Appointment, "id">): Promise<Appointment> {
    try {
      // Format the date and time as a proper ISO string for start_time
      const startTime = new Date(`${appointmentData.date}T${appointmentData.time}`);
      
      // Calculate end_time if provided
      let endTime = null;
      if (appointmentData.end_time) {
        endTime = new Date(`${appointmentData.date}T${appointmentData.end_time}`);
      }

      const { data, error } = await supabase
        .from("consultations")
        .insert({
          id: generateUUID(),
          patient_id: appointmentData.patient_id,
          start_time: startTime.toISOString(),
          end_time: endTime ? endTime.toISOString() : null,
          status: appointmentData.status,
          payment_method: appointmentData.payment_method,
          notes: appointmentData.notes,
          consultation_type_id: appointmentData.consultation_type_id,
          doctor_id: appointmentData.doctor_id,
        })
        .select();

      if (error) {
        console.error("Error creating appointment:", error);
        throw error;
      }

      // Return the created appointment
      return {
        ...appointmentData,
        id: data[0].id
      };
    } catch (error) {
      console.error("Failed to create appointment:", error);
      throw error;
    }
  },

  /**
   * Updates an existing appointment
   */
  async updateAppointment(appointmentId: string, appointmentData: Partial<Appointment>): Promise<Appointment> {
    try {
      const updateData: any = {};

      // Only include fields that are provided in the update
      if (appointmentData.patient_id) updateData.patient_id = appointmentData.patient_id;
      
      // Format date and time if provided
      if (appointmentData.date && appointmentData.time) {
        const startTime = new Date(`${appointmentData.date}T${appointmentData.time}`);
        updateData.start_time = startTime.toISOString();
      }
      
      // Calculate end_time if provided
      if (appointmentData.date && appointmentData.end_time) {
        const endTime = new Date(`${appointmentData.date}T${appointmentData.end_time}`);
        updateData.end_time = endTime.toISOString();
      }
      
      if (appointmentData.status) updateData.status = appointmentData.status;
      if (appointmentData.payment_method) updateData.payment_method = appointmentData.payment_method;
      if (appointmentData.notes !== undefined) updateData.notes = appointmentData.notes;
      if (appointmentData.consultation_type_id) updateData.consultation_type_id = appointmentData.consultation_type_id;
      if (appointmentData.doctor_id) updateData.doctor_id = appointmentData.doctor_id;

      const { data, error } = await supabase
        .from("consultations")
        .update(updateData)
        .eq("id", appointmentId)
        .select();

      if (error) {
        console.error("Error updating appointment:", error);
        throw error;
      }

      // Return the updated appointment
      return {
        ...appointmentData as Appointment,
        id: appointmentId
      };
    } catch (error) {
      console.error("Failed to update appointment:", error);
      throw error;
    }
  },

  /**
   * Cancels an appointment
   */
  async cancelAppointment(appointmentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("consultations")
        .update({ status: "cancelado" })
        .eq("id", appointmentId);

      if (error) {
        console.error("Error canceling appointment:", error);
        throw error;
      }
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      throw error;
    }
  }
};
