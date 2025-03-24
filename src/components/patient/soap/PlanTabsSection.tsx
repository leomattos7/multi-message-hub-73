
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileText, FileCheck, FileOutput, ListTodo } from "lucide-react";

interface PlanTabsSectionProps {
  plan: {
    prescriptions: string;
    certificates: string;
    guidance: string;
    tasks: string;
  };
  onChange: (field: string, value: string) => void;
  activePlanTab: string;
  setActivePlanTab: (tab: string) => void;
}

export const PlanTabsSection: React.FC<PlanTabsSectionProps> = ({
  plan,
  onChange,
  activePlanTab,
  setActivePlanTab,
}) => {
  return (
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
            value={plan.prescriptions}
            onChange={(e) => onChange("prescriptions", e.target.value)}
            className="min-h-[100px] w-full"
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
      </Tabs>
    </div>
  );
};
