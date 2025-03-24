
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SoapSection } from "./SoapSection";
import { PlanTabsSection } from "./PlanTabsSection";
import { SoapNotes, SoapNotesFormProps, Prescription } from "./types";

export { type SoapNotes } from "./types";

export const SoapNotesForm: React.FC<SoapNotesFormProps> = ({ 
  onSave, 
  isLoading = false 
}) => {
  const [notes, setNotes] = useState<SoapNotes>({
    subjective: "",
    objective: "",
    assessment: "",
    planNotes: "", // Added new field with empty default
    plan: {
      prescriptions: [],
      certificates: "",
      guidance: "",
      tasks: "",
      exams: ""
    }
  });

  const [activePlanTab, setActivePlanTab] = useState<string>("prescriptions");

  const handleChange = (field: keyof Omit<SoapNotes, "plan">) => (value: string) => {
    setNotes(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlanChange = (subfield: keyof SoapNotes["plan"] | "planNotes", value: any) => {
    if (subfield === "planNotes") {
      setNotes(prev => ({
        ...prev,
        planNotes: value
      }));
    } else {
      setNotes(prev => ({
        ...prev,
        plan: {
          ...prev.plan,
          [subfield]: value
        }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(notes);
  };

  const isFormValid = () => {
    // At least one field must have content (including plan subfields)
    return (
      notes.subjective.trim() !== "" || 
      notes.objective.trim() !== "" || 
      notes.assessment.trim() !== "" ||
      notes.planNotes.trim() !== "" || // Added new field check
      notes.plan.prescriptions.length > 0 ||
      notes.plan.certificates.trim() !== "" ||
      notes.plan.guidance.trim() !== "" ||
      notes.plan.tasks.trim() !== "" ||
      notes.plan.exams.trim() !== ""
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SoapSection
        id="subjective"
        label="Subjetivo"
        value={notes.subjective}
        placeholder="Queixas do paciente, histórico da doença atual..."
        onChange={handleChange("subjective")}
      />
      
      <SoapSection
        id="objective"
        label="Objetivo"
        value={notes.objective}
        placeholder="Dados do exame físico, sinais vitais, resultados de exames..."
        onChange={handleChange("objective")}
      />
      
      <SoapSection
        id="assessment"
        label="Avaliação"
        value={notes.assessment}
        placeholder="Interpretação clínica, diagnósticos, impressões..."
        onChange={handleChange("assessment")}
      />
      
      <PlanTabsSection
        plan={notes.plan}
        planNotes={notes.planNotes} // Pass the new field
        onChange={(field, value) => handlePlanChange(field as keyof SoapNotes["plan"] | "planNotes", value)}
        activePlanTab={activePlanTab}
        setActivePlanTab={setActivePlanTab}
      />
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading || !isFormValid()}
      >
        {isLoading ? "Salvando..." : "Salvar Consulta"}
      </Button>
    </form>
  );
};
