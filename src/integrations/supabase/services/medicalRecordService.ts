
import { supabase } from '../client';
import { MedicalRecord } from '@/types/patient';

export interface MedicalRecordWithPatient extends MedicalRecord {
  patient: {
    id: string;
    full_name: string;
  };
}

export const medicalRecordService = {
  async getMedicalRecords(patientId: string, recordType?: string) {
    try {
      let query = supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', patientId);
      
      if (recordType) {
        query = query.eq('record_type', recordType);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MedicalRecord[];
    } catch (error) {
      console.error("Error fetching medical records:", error);
      throw error;
    }
  },
  
  async getMedicalRecordById(id: string) {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          *,
          patients (id, full_name)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      const record: MedicalRecordWithPatient = {
        id: data.id,
        patient_id: data.patient_id,
        record_date: data.record_date,
        record_type: data.record_type,
        content: data.content,
        created_at: data.created_at,
        updated_at: data.updated_at,
        patient: {
          id: data.patients.id,
          full_name: data.patients.full_name
        }
      };
      
      return record;
    } catch (error) {
      console.error("Error fetching medical record:", error);
      throw error;
    }
  },
  
  async createMedicalRecord(record: {
    patient_id: string;
    record_type: string;
    content: string;
    record_date?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .insert({
          patient_id: record.patient_id,
          record_type: record.record_type,
          content: record.content,
          record_date: record.record_date || new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as MedicalRecord;
    } catch (error) {
      console.error("Error creating medical record:", error);
      throw error;
    }
  },
  
  async updateMedicalRecord(id: string, updates: {
    record_type?: string;
    content?: string;
    record_date?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .update({
          record_type: updates.record_type,
          content: updates.content,
          record_date: updates.record_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as MedicalRecord;
    } catch (error) {
      console.error("Error updating medical record:", error);
      throw error;
    }
  },
  
  async deleteMedicalRecord(id: string) {
    try {
      const { error } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error deleting medical record:", error);
      throw error;
    }
  }
};
