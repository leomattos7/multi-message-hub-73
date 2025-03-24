
export interface SoapNotes {
  subjective: string;
  objective: string;
  assessment: string;
  plan: {
    prescriptions: string;
    certificates: string;
    guidance: string;
    tasks: string;
  };
}

export interface SoapNotesFormProps {
  onSave: (notes: SoapNotes) => void;
  isLoading?: boolean;
}
