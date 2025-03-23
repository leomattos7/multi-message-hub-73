
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { SectionType } from "@/hooks/use-collapsible-sections";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";

interface CollapsibleSectionProps {
  id: SectionType;
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
  children?: React.ReactNode;
}

export function CollapsibleSection({ 
  id, 
  title, 
  isExpanded, 
  onToggle, 
  index, 
  children 
}: CollapsibleSectionProps) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-3"
        >
          <Card>
            <Collapsible open={isExpanded} onOpenChange={onToggle}>
              <div className="flex items-center justify-between py-3 px-3">
                <div className="flex items-center">
                  <div {...provided.dragHandleProps} className="mr-3 cursor-grab flex items-center">
                    <GripVertical size={18} className="text-gray-400" />
                  </div>
                  <h3 className="text-md font-medium">{title}</h3>
                </div>
                <CollapsibleTrigger asChild>
                  <button className="p-1 rounded-md hover:bg-gray-100 flex items-center justify-center">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <CardContent className="pt-3 pb-3">
                  {children || (
                    <div className="text-sm text-gray-500 italic">
                      Sem informações disponíveis
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
