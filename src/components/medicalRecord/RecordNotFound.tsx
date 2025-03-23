
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const RecordNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/prontuarios")} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
        <FileText className="h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-600">Prontuário não encontrado</h3>
      </div>
    </div>
  );
};
