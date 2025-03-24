
import React from "react";
import { EmptyStateDisplay } from "./EmptyStateDisplay";
import { FileText } from "lucide-react";

export const TasksTab: React.FC = () => {
  return (
    <EmptyStateDisplay
      icon={<FileText className="h-12 w-12 text-gray-400 mb-3" />}
      title="Nenhuma tarefa pendente"
      description="Adicione tarefas para acompanhamento deste paciente"
    />
  );
};
