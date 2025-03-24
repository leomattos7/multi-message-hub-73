
import React, { useState } from "react";
import { FileText, Plus, Square, SquareCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export const TasksTab: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = () => {
    if (newTaskText.trim() === "") {
      toast({
        title: "Tarefa vazia",
        description: "Por favor, insira o texto da tarefa",
        variant: "destructive",
      });
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskText("");
    
    toast({
      title: "Tarefa adicionada",
      description: "A tarefa foi adicionada com sucesso",
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    
    toast({
      title: "Tarefa removida",
      description: "A tarefa foi removida com sucesso",
    });
  };

  // Sort tasks: incomplete first, completed last
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  // Task input field component
  const TaskInputField = () => (
    <div className="flex gap-2 mb-4">
      <Input
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
        placeholder="Digite uma nova tarefa"
        onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
      />
      <Button onClick={handleAddTask} className="shrink-0">
        <Plus className="h-4 w-4 mr-2" />
        Adicionar
      </Button>
    </div>
  );

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <TaskInputField />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Tarefas do paciente</h3>
        
        {/* Input field at the top of the list */}
        <TaskInputField />
        
        <ul className="space-y-3">
          {sortedTasks.map((task) => (
            <li 
              key={task.id} 
              className="flex items-start gap-2 p-3 border rounded-md hover:bg-gray-50 group"
            >
              <button
                onClick={() => toggleTaskCompletion(task.id)}
                className="mt-0.5 flex-shrink-0 focus:outline-none"
                aria-label={task.completed ? "Marcar como não concluída" : "Marcar como concluída"}
              >
                {task.completed ? (
                  <SquareCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <Square className="h-5 w-5 text-gray-400" />
                )}
              </button>
              <span 
                className={`flex-1 ${
                  task.completed ? "text-gray-500 line-through" : ""
                }`}
              >
                {task.text}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remover tarefa"
              >
                <span className="sr-only">Remover</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-500"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
