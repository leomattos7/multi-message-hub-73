
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, FileText, FileCheck, FileOutput, ListTodo } from "lucide-react";

interface SoapNotesFormProps {
  onSave: (notes: SoapNotes) => void;
  isLoading?: boolean;
}

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

export const SoapNotesForm = ({ onSave, isLoading = false }: SoapNotesFormProps) => {
  const [notes, setNotes] = useState<SoapNotes>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: {
      prescriptions: "",
      certificates: "",
      guidance: "",
      tasks: ""
    }
  });

  const [activePlanTab, setActivePlanTab] = useState<string>("prescriptions");

  const handleChange = (field: keyof Omit<SoapNotes, "plan">) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handlePlanChange = (subfield: keyof SoapNotes["plan"]) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(prev => ({
      ...prev,
      plan: {
        ...prev.plan,
        [subfield]: e.target.value
      }
    }));
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
      Object.values(notes.plan).some(value => value.trim() !== "")
    );
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
        <Tabs value={activePlanTab} onValueChange={setActivePlanTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="prescriptions" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Receitas</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-1">
              <FileCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Atestados</span>
            </TabsTrigger>
            <TabsTrigger value="guidance" className="flex items-center gap-1">
              <FileOutput className="h-4 w-4" />
              <span className="hidden sm:inline">Orientações</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-1">
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">Tarefas</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="prescriptions">
            <Textarea
              id="plan-prescriptions"
              placeholder="Prescrições médicas, medicamentos, posologia..."
              value={notes.plan.prescriptions}
              onChange={handlePlanChange("prescriptions")}
              className="min-h-[100px] w-full"
            />
          </TabsContent>
          
          <TabsContent value="certificates">
            <Textarea
              id="plan-certificates"
              placeholder="Atestados médicos, licenças, declarações..."
              value={notes.plan.certificates}
              onChange={handlePlanChange("certificates")}
              className="min-h-[100px] w-full"
            />
          </TabsContent>
          
          <TabsContent value="guidance">
            <Textarea
              id="plan-guidance"
              placeholder="Orientações ao paciente, cuidados específicos, recomendações..."
              value={notes.plan.guidance}
              onChange={handlePlanChange("guidance")}
              className="min-h-[100px] w-full"
            />
          </TabsContent>
          
          <TabsContent value="tasks">
            <Textarea
              id="plan-tasks"
              placeholder="Tarefas a serem realizadas, acompanhamentos, retornos..."
              value={notes.plan.tasks}
              onChange={handlePlanChange("tasks")}
              className="min-h-[100px] w-full"
            />
          </TabsContent>
        </Tabs>
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
