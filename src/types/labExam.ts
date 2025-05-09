
export interface LabExam {
  id: string;
  patient_id: string;
  exam_name: string;
  exam_date: string;
  results: string;
  lab_name?: string;
  doctor_notes?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
  
  // Fields used in UI
  name?: string;
  result?: string;
  reference_range?: string;
  is_abnormal?: boolean;
}

export interface LabExamWithFile extends LabExam {
  file?: File;
}
