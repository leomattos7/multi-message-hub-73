
export interface Measurement {
  id: string;
  patient_id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  created_at: string;
}

export interface CalculatedMeasurement {
  name: string;
  value: number | string;
  unit: string;
}

export interface MeasurementForm {
  name: string;
  value: number | string;
  unit: string;
}
