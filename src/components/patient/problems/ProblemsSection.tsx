
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { usePatientRecordsData } from "@/hooks/use-patient-records-data";
import { ProblemItem } from "@/types/problem";
import { ProblemCard } from "./ProblemCard";
import { ProblemDialog } from "./ProblemDialog";
import { DeleteProblemDialog } from "./DeleteProblemDialog";

interface ProblemsSectionProps {
  patientId?: string;
}

export const ProblemsSection = ({ patientId }: ProblemsSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProblem, setNewProblem] = useState("");
  const [problemCID, setProblemCID] = useState("");
  const [problemCIAP, setProblemCIAP] = useState("");
  const [problemToDelete, setProblemToDelete] = useState<string | null>(null);
  
  const { 
    records: problems, 
    recordsLoading, 
    createRecord, 
    deleteRecord 
  } = usePatientRecordsData(patientId, "problema");

  const handleAddProblem = async () => {
    if (!newProblem.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Nome do problema/diagnóstico é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    const problemData = {
      name: newProblem,
      cid: problemCID,
      ciap: problemCIAP
    };

    try {
      await createRecord(JSON.stringify(problemData), "problema");
      setNewProblem("");
      setProblemCID("");
      setProblemCIAP("");
      setIsDialogOpen(false);
      
      toast({
        title: "Problema adicionado",
        description: "O problema/diagnóstico foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao adicionar problema:", error);
      toast({
        title: "Erro ao adicionar problema",
        description: "Houve um erro ao adicionar o problema/diagnóstico. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProblem = async () => {
    if (!problemToDelete) return;
    
    try {
      await deleteRecord(problemToDelete);
      
      toast({
        title: "Problema removido",
        description: "O problema/diagnóstico foi removido com sucesso.",
      });
      
      setProblemToDelete(null);
    } catch (error) {
      console.error("Erro ao remover problema:", error);
      toast({
        title: "Erro ao remover problema",
        description: "Houve um erro ao remover o problema/diagnóstico. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Parser function to handle different problem data formats
  const parseProblemData = (prob: any): ProblemItem => {
    try {
      if (typeof prob.content === 'string') {
        return {
          ...JSON.parse(prob.content),
          id: prob.id,
          created_at: prob.created_at
        };
      }
    } catch (e) {
      // Fallback for old format
    }
    
    return {
      id: prob.id,
      name: prob.content,
      created_at: prob.created_at
    };
  };

  return (
    <div className="space-y-4">
      {/* Problems List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Problemas e diagnósticos registrados</h3>
        {recordsLoading ? (
          <p className="text-sm text-gray-500">Carregando problemas...</p>
        ) : problems && problems.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {problems.map((prob) => {
              const problemData = parseProblemData(prob);
              return (
                <ProblemCard 
                  key={prob.id} 
                  problem={problemData}
                  onDelete={(id) => setProblemToDelete(id)}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Nenhum problema/diagnóstico registrado</p>
        )}
      </div>

      {/* Add Problem Button */}
      <div className="flex justify-center">
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          size="sm"
          className="rounded-full h-10 w-10 p-0 bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Add Problem Dialog */}
      <ProblemDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        newProblem={newProblem}
        setNewProblem={setNewProblem}
        problemCID={problemCID}
        setProblemCID={setProblemCID}
        problemCIAP={problemCIAP}
        setProblemCIAP={setProblemCIAP}
        onAdd={handleAddProblem}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteProblemDialog
        isOpen={!!problemToDelete}
        onOpenChange={() => setProblemToDelete(null)}
        onDelete={handleDeleteProblem}
      />
    </div>
  );
};
