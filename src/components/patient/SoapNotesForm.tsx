
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface SoapNotesFormProps {
  onSave: (notes: SoapNotes) => void;
  isLoading?: boolean;
}

export interface SoapNotes {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export const SoapNotesForm = ({ onSave, isLoading = false }: SoapNotesFormProps) => {
  const [notes, setNotes] = useState<SoapNotes>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  });

  const handleChange = (field: keyof SoapNotes) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(notes);
  };

  const isFormValid = () => {
    // At least one field must have content
    return Object.values(notes).some(value => value.trim() !== "");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="subjective" className="block text-sm font-medium text-gray-700 mb-1">
          Subjetivo
        </label>
        <Textarea
          id="subjective"
          placeholder="Queixas do paciente, histórico da doença atual..."
          value={notes.subjective}
          onChange={handleChange("subjective")}
          className="min-h-[80px]"
        />
      </div>
      
      <div>
        <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-1">
          Objetivo
        </label>
        <Textarea
          id="objective"
          placeholder="Dados do exame físico, sinais vitais, resultados de exames..."
          value={notes.objective}
          onChange={handleChange("objective")}
          className="min-h-[80px]"
        />
      </div>
      
      <div>
        <label htmlFor="assessment" className="block text-sm font-medium text-gray-700 mb-1">
          Avaliação
        </label>
        <Textarea
          id="assessment"
          placeholder="Interpretação clínica, diagnósticos, impressões..."
          value={notes.assessment}
          onChange={handleChange("assessment")}
          className="min-h-[80px]"
        />
      </div>
      
      <div>
        <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-1">
          Plano
        </label>
        <Textarea
          id="plan"
          placeholder="Tratamento proposto, medicações, exames a solicitar, encaminhamentos..."
          value={notes.plan}
          onChange={handleChange("plan")}
          className="min-h-[80px]"
        />
      </div>
      
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
