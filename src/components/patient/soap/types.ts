
export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  route: string;
  continuous: boolean;
}

export interface SoapNotes {
  subjective: string;
  objective: string;
  assessment: string;
  planNotes: string; // Added this new field for general plan notes
  plan: {
    prescriptions: Prescription[];
    certificates: string;
    guidance: string;
    tasks: string;
    exams: string;
  };
}

export interface SoapNotesFormProps {
  onSave: (notes: SoapNotes) => Promise<boolean> | void;
  isLoading?: boolean;
}
