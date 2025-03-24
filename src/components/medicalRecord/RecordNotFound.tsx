
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileX, ChevronLeft } from "lucide-react";

export const RecordNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center h-96">
        <FileX className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Prontuário não encontrado</h2>
        <p className="text-gray-500 mb-6 text-center">
          O prontuário que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={() => navigate("/prontuarios")} className="flex items-center">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar para a lista de prontuários
        </Button>
      </div>
    </div>
  );
};
