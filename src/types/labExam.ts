
export interface LabExam {
  id: string;
  patient_id: string;
  exam_date: string;
  name: string;
  result?: string;
  reference_value?: string;
  is_abnormal?: boolean;
  created_at: string;
}
