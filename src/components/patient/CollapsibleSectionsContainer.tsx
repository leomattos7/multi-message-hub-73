
import React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { CollapsibleSection } from "./CollapsibleSection";
import { SectionType, useCollapsibleSections } from "@/hooks/use-collapsible-sections";

interface CollapsibleSectionsContainerProps {
  patientId?: string;
  renderSectionContent?: (sectionId: SectionType) => React.ReactNode;
}

export function CollapsibleSectionsContainer({
  patientId,
  renderSectionContent
}: CollapsibleSectionsContainerProps) {
  const { sections, expandedSections, toggleSection, reorderSections } = useCollapsibleSections(patientId);

  const handleDragEnd = (result: DropResult) => {
    // Descarta resultados onde não há destino
    if (!result.destination) return;
    
    // Descarta se o item foi solto no mesmo lugar
    if (result.destination.index === result.source.index) return;
    
    // Reordena as seções
    reorderSections(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections-list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-1"
          >
            {sections.map((section, index) => (
              <CollapsibleSection
                key={section.id}
                id={section.id}
                title={section.title}
                isExpanded={expandedSections[section.id]}
                onToggle={() => toggleSection(section.id)}
                index={index}
              >
                {renderSectionContent && renderSectionContent(section.id)}
              </CollapsibleSection>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
