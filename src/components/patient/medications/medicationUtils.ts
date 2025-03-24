
import { MedicationItem } from "@/types/medication";

export const parseMedicationData = (med: any): MedicationItem => {
  try {
    if (typeof med.content === 'string') {
      return {
        ...JSON.parse(med.content),
        id: med.id,
        created_at: med.created_at
      };
    }
  } catch (e) {
    // Fallback for old format
  }
  
  return {
    id: med.id,
    name: med.content,
    created_at: med.created_at
  };
};
