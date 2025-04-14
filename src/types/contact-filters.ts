
/**
 * Common filter interface for patient queries
 * This should match PatientFilters structure
 */
export interface ContactFilters {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  biologicalSex?: 'male' | 'female' | 'intersex' | 'not_informed' | 'all';
  genderIdentity?: 'man' | 'woman' | 'non_binary' | 'other' | 'not_informed' | 'all';
  paymentMethod?: 'particular' | 'convenio' | 'all';
  insuranceName?: string;
  lastActivity?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all';
  hasAppointment?: 'yes' | 'no' | 'all';
}
