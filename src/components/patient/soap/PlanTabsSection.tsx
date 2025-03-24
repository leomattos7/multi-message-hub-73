
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileText, FileCheck, FileOutput, ListTodo, TestTube } from "lucide-react";
import { PrescriptionForm } from "./PrescriptionForm";
import { Prescription } from "./types";

interface PlanTabsSectionProps {
  plan: {
    prescriptions: Prescription[];
    certificates: string;
    guidance: string;
    tasks: string;
    exams: string;
  };
  planNotes: string; // Added this field
  onChange: (field: string, value: any) => void;
  activePlanTab: string;
  setActivePlanTab: (tab: string) => void;
}

export const PlanTabsSection: React.FC<PlanTabsSectionProps> = ({
  plan,
  planNotes, // Use this field
  onChange,
  activePlanTab,
  setActivePlanTab,
}) => {
  return (
    <div>
      <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-1">
        Plano
      </label>
      
      {/* Add the general plan notes field */}
      <Textarea
        id="plan-notes"
        placeholder="Anotações gerais do plano..."
        value={planNotes}
        onChange={(e) => onChange("planNotes", e.target.value)}
        className="min-h-[80px] w-full mb-4"
      />
      
      <Tabs value={activePlanTab} onValueChange={setActivePlanTab} className="w-full">
        <TabsList className="w-full grid grid-cols-5">
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
          <TabsTrigger value="exams" className="flex items-center gap-1">
            <TestTube className="h-4 w-4" />
            <span className="hidden sm:inline">Exames</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="prescriptions">
          <PrescriptionForm
            prescriptions={plan.prescriptions}
            onChange={(prescriptions) => onChange("prescriptions", prescriptions)}
          />
        </TabsContent>
        
        <TabsContent value="certificates">
          <Textarea
            id="plan-certificates"
            placeholder="Atestados médicos, licenças, declarações..."
            value={plan.certificates}
            onChange={(e) => onChange("certificates", e.target.value)}
            className="min-h-[100px] w-full"
          />
        </TabsContent>
        
        <TabsContent value="guidance">
          <Textarea
            id="plan-guidance"
            placeholder="Orientações ao paciente, cuidados específicos, recomendações..."
            value={plan.guidance}
            onChange={(e) => onChange("guidance", e.target.value)}
            className="min-h-[100px] w-full"
          />
        </TabsContent>
        
        <TabsContent value="tasks">
          <Textarea
            id="plan-tasks"
            placeholder="Tarefas a serem realizadas, acompanhamentos, retornos..."
            value={plan.tasks}
            onChange={(e) => onChange("tasks", e.target.value)}
            className="min-h-[100px] w-full"
          />
        </TabsContent>
        
        <TabsContent value="exams">
          <Textarea
            id="plan-exams"
            placeholder="Exames laboratoriais, de imagem, procedimentos diagnósticos..."
            value={plan.exams}
            onChange={(e) => onChange("exams", e.target.value)}
            className="min-h-[100px] w-full"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
