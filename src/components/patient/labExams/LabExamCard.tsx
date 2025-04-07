
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LabExam } from "@/types/labExam";
import { Card, CardContent } from "@/components/ui/card";
import { X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LabExamCardProps {
  exam: LabExam;
  onDelete: (examId: string) => void;
  onEdit: (exam: LabExam) => void;
}

export const LabExamCard = ({ exam, onDelete, onEdit }: LabExamCardProps) => {
  const formattedDate = exam.exam_date 
    ? format(new Date(exam.exam_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "Data não informada";

  return (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="flex justify-between">
          <div className={`flex-1 p-2 rounded-md ${exam.is_abnormal ? 'bg-[#FFDEE2]' : 'bg-[#F2FCE2]'}`}>
            <div className="flex justify-between">
              <h4 className="font-medium">{exam.name}</h4>
              <div className="flex space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-gray-500 hover:text-blue-500" 
                        onClick={() => onEdit(exam)}
                      >
                        <Pencil size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar exame</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-gray-500 hover:text-red-500" 
                        onClick={() => onDelete(exam.id)}
                      >
                        <X size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Excluir exame</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="text-sm">
              <p><strong>Resultado:</strong> {exam.result}</p>
              {exam.reference_range && (
                <p><strong>Valor de referência:</strong> {exam.reference_range}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
