
import { Patient } from '@/types';
import { PatientFilters } from '@/types/patient-filters';
import { apiService } from './api-service';
import { generatePatientIdFromCPF } from '@/utils/patient-id-utils';

/**
 * Creates a new patient via the API
 */
export const createPatient = async (
  patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>, 
  doctorId: string
): Promise<Patient> => {
  // Generate ID from CPF if provided, otherwise use a random ID
  const id = patientData.cpf 
    ? generatePatientIdFromCPF(patientData.cpf)
    : crypto.randomUUID();
  
  const now = new Date().toISOString();
  
  const patient = {
    id,
    ...patientData,
    doctor_id: doctorId,
    created_at: now,
    updated_at: now
  };
  
  return await apiService.post<Patient>('/patients', patient, doctorId);
};

/**
 * Updates an existing patient via the API
 */
export const updatePatient = async (patientData: Patient, userId?: string): Promise<Patient> => {
  const updatedPatient = {
    ...patientData,
    updated_at: new Date().toISOString()
  };
  
  return await apiService.put<Patient>(`/patients/${patientData.id}`, updatedPatient, userId);
};

/**
 * Gets a patient by ID via the API
 */
export const getPatientById = async (patientId: string, doctorId?: string): Promise<Patient | null> => {
  try {
    return await apiService.get<Patient>(`/patients/${patientId}`, doctorId, { doctorId });
  } catch (error) {
    console.error('Error fetching patient:', error);
    return null;
  }
};

/**
 * Gets patients by doctor ID via the API
 */
export const getPatientsByDoctorId = async (doctorId: string, filters?: PatientFilters): Promise<Patient[]> => {
  try {
    return await apiService.get<Patient[]>('/patients', doctorId, { 
      doctorId,
      ...filters
    });
  } catch (error) {
    console.error('Error fetching patients by doctor ID:', error);
    return [];
  }
};

/**
 * Deletes a patient via the API
 */
export const deletePatient = async (patientId: string, userId?: string): Promise<void> => {
  await apiService.delete(`/patients/${patientId}`, userId);
};
