
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface RecordContentProps {
  content: string;
  isEditing: boolean;
  editedContent: string;
  onContentChange: (content: string) => void;
}

export const RecordContent: React.FC<RecordContentProps> = ({
  content,
  isEditing,
  editedContent,
  onContentChange,
}) => {
  // Format SOAP notes for display
  const formatSoapNotes = (content: string) => {
    if (!content.includes("**Subjetivo:**")) {
      return content;
    }

    // Split the content by the section headers
    const sections = [
      { title: "Subjetivo", content: "" },
      { title: "Objetivo", content: "" },
      { title: "Avaliação", content: "" },
      { title: "Plano", content: "" },
    ];

    // Extract content for each section
    for (let i = 0; i < sections.length; i++) {
      const currentSection = `**${sections[i].title}:**`;
      const nextSection = i < sections.length - 1 ? `**${sections[i + 1].title}:**` : null;
      
      const startIdx = content.indexOf(currentSection) + currentSection.length;
      const endIdx = nextSection ? content.indexOf(nextSection) : content.length;
      
      if (startIdx >= currentSection.length && endIdx > startIdx) {
        sections[i].content = content.substring(startIdx, endIdx).trim();
      }
    }

    // Extract subsections from the Plan section if they exist
    const planSection = sections[3];
    const planSubsections = [];
    
    const subSectionTitles = ["**Receitas:**", "**Atestados:**", "**Orientações:**", "**Tarefas:**", "**Exames:**"];
    
    if (planSection.content.includes(subSectionTitles[0])) {
      for (let i = 0; i < subSectionTitles.length; i++) {
        const currentSubsection = subSectionTitles[i];
        const nextSubsection = i < subSectionTitles.length - 1 ? subSectionTitles[i + 1] : null;
        
        if (planSection.content.indexOf(currentSubsection) === -1) continue;
        
        const startIdx = planSection.content.indexOf(currentSubsection) + currentSubsection.length;
        const endIdx = nextSubsection && planSection.content.indexOf(nextSubsection) !== -1 
          ? planSection.content.indexOf(nextSubsection) 
          : planSection.content.length;
        
        if (startIdx >= currentSubsection.length) {
          const subContent = planSection.content.substring(startIdx, endIdx).trim();
          const title = currentSubsection.replace(/\*\*/g, "").replace(":", "");
          planSubsections.push({ title, content: subContent });
        }
      }
    }

    return (
      <div className="space-y-6">
        {sections.slice(0, 3).map((section) => (
          <Card key={section.title} className="overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 font-medium">{section.title}</div>
            <CardContent className="pt-4">
              <div className="whitespace-pre-wrap">{section.content || "Não informado"}</div>
            </CardContent>
          </Card>
        ))}
        
        <Card className="overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 font-medium">Plano</div>
          <CardContent className="pt-4">
            {planSubsections.length > 0 ? (
              <div className="space-y-4">
                {planSubsections.map((subsection) => (
                  <div key={subsection.title}>
                    <h4 className="font-medium text-gray-800 mb-1">{subsection.title}</h4>
                    <div className="whitespace-pre-wrap pl-4">{subsection.content || "Não informado"}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{sections[3].content || "Não informado"}</div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isEditing) {
    return (
      <div className="p-4 border rounded-md bg-white">
        <Textarea
          className="min-h-[500px] font-mono text-sm"
          value={editedContent}
          onChange={(e) => onContentChange(e.target.value)}
        />
      </div>
    );
  }

  // If it's a SOAP note, format it specially
  if (content.includes("**Subjetivo:**")) {
    return formatSoapNotes(content);
  }

  // For regular content
  return (
    <div className="p-4 border rounded-md bg-white">
      <div className="whitespace-pre-wrap">{content}</div>
    </div>
  );
};
