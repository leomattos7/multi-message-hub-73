
export interface LabExam {
  id: string;
  name: string;
  result: string;
  reference_range?: string;
  is_abnormal: boolean;
  exam_date: string;
  created_at: string;
  patient_id: string;
}
