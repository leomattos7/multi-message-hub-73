
export interface Measurement {
  id: string;
  patient_id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

// Add missing types that are being used elsewhere
export interface MeasurementForm {
  id?: string;
  patient_id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
}

export interface CalculatedMeasurement extends Measurement {
  calculatedValue?: number;
  status?: string;
  normalRange?: {
    min: number;
    max: number;
  };
}
