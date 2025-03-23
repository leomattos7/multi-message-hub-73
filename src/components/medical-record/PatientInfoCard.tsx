
import React from "react";
import { Calendar, Clock, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PatientSummaryItem, PatientSummaryItemType } from "@/components/PatientSummaryItem";
import { MedicalRecord, recordTypeDisplay } from "./types";

interface PatientInfoCardProps {
  record: MedicalRecord;
  summaryItems: PatientSummaryItemType[];
  onDragEnd: (result: any) => void;
}

export const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ 
  record, 
  summaryItems, 
  onDragEnd 
}) => {
  // Format date helper function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="patientSummaryItems">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {summaryItems.map((item, index) => (
                  <Draggable key={item + index} draggableId={item + index} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <PatientSummaryItem 
                          type={item} 
                          isDragging={snapshot.isDragging}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500">Criado em</h3>
          <div className="mt-1 flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <p>{formatDate(record.created_at)}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500">Última atualização</h3>
          <div className="mt-1 flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <p>{formatDate(record.updated_at)}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500">Tipo de prontuário</h3>
          <div className="mt-1 flex items-center">
            <FileText className="h-5 w-5 text-gray-400 mr-2" />
            <p>{recordTypeDisplay[record.record_type]}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
