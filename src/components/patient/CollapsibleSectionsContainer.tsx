
import React, { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { CollapsibleSection } from "./CollapsibleSection";
import { SectionType, useCollapsibleSections } from "@/hooks/use-collapsible-sections";

interface CollapsibleSectionsContainerProps {
  patientId?: string;
  renderSectionContent?: (sectionId: SectionType, patientId?: string) => React.ReactNode;
}

export function CollapsibleSectionsContainer({
  patientId,
  renderSectionContent
}: CollapsibleSectionsContainerProps) {
  const { sections, expandedSections, toggleSection, reorderSections } = useCollapsibleSections(patientId);

  // Force refresh of localStorage data
  useEffect(() => {
    if (patientId) {
      const storedSections = localStorage.getItem(`patient-${patientId}-sections-order`);
      if (storedSections) {
        try {
          const parsedSections = JSON.parse(storedSections);
          // Update any old "Medicações Atuais" title to "Medições"
          const updatedSections = parsedSections.map((section: any) => {
            if (section.id === "medicoes" && section.title !== "Medições") {
              return { ...section, title: "Medições" };
            }
            return section;
          });
          
          // Only update if changes were made
          if (JSON.stringify(parsedSections) !== JSON.stringify(updatedSections)) {
            localStorage.setItem(`patient-${patientId}-sections-order`, JSON.stringify(updatedSections));
          }
        } catch (error) {
          console.error("Erro ao processar ordem das seções:", error);
        }
      }
    }
  }, [patientId]);

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
                {renderSectionContent && renderSectionContent(section.id, patientId)}
              </CollapsibleSection>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
