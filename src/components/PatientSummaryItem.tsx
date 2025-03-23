
import React from "react";
import { Pill, AlertTriangle, FileSearch, User, Users, GripVertical } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export type PatientSummaryItemType = 
  | "medications" 
  | "problems" 
  | "exams" 
  | "allergies"
  | "personalHistory"
  | "familyHistory";

interface PatientSummaryItemProps {
  type: PatientSummaryItemType;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export const PatientSummaryItem: React.FC<PatientSummaryItemProps> = ({
  type,
  isDragging = false,
  dragHandleProps
}) => {
  // Define title and icon based on the type
  const getTypeDetails = (type: PatientSummaryItemType) => {
    switch (type) {
      case "medications":
        return { 
          title: "Medicações", 
          icon: <Pill className="h-5 w-5 text-blue-500" /> 
        };
      case "problems":
        return { 
          title: "Problemas", 
          icon: <AlertTriangle className="h-5 w-5 text-orange-500" /> 
        };
      case "exams":
        return { 
          title: "Últimos Exames", 
          icon: <FileSearch className="h-5 w-5 text-purple-500" /> 
        };
      case "allergies":
        return { 
          title: "Alergias", 
          icon: <AlertTriangle className="h-5 w-5 text-red-500" /> 
        };
      case "personalHistory":
        return { 
          title: "Antecedente Pessoal", 
          icon: <User className="h-5 w-5 text-green-500" /> 
        };
      case "familyHistory":
        return { 
          title: "Histórico Familiar", 
          icon: <Users className="h-5 w-5 text-indigo-500" /> 
        };
      default:
        return { 
          title: "Informação", 
          icon: <User className="h-5 w-5" /> 
        };
    }
  };

  const { title, icon } = getTypeDetails(type);

  return (
    <Collapsible 
      className={cn(
        "w-full rounded-md border shadow-sm mb-2 bg-white",
        isDragging && "border-blue-500 shadow-md"
      )}
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-50 rounded-md">
        <div className="flex items-center">
          {icon}
          <span className="ml-2 font-medium">{title}</span>
        </div>
        <div className="cursor-grab" {...dragHandleProps}>
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-3 text-sm text-gray-600 border-t">
        <p>Nenhuma informação disponível sobre {title.toLowerCase()}.</p>
      </CollapsibleContent>
    </Collapsible>
  );
};
