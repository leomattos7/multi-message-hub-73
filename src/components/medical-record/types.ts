
import { PatientSummaryItemType } from "@/components/PatientSummaryItem";

export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  biological_sex?: string;
  gender_identity?: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  patient?: Patient;
  record_date: string;
  record_type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const recordTypeDisplay: Record<string, string> = {
  anamnesis: "Anamnese",
  consultation: "Consulta",
  exam: "Exame",
  prescription: "Receita",
  evolution: "Evolução",
};
