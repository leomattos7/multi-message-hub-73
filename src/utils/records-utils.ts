
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const isToday = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

export const extractSummary = (content: string): string => {
  if (!content) return '';
  
  // For SOAP notes, try to extract the first non-empty section
  if (content.includes("**Subjetivo:**")) {
    const sections = [
      { label: "**Subjetivo:**", value: "" },
      { label: "**Objetivo:**", value: "" },
      { label: "**Avaliação:**", value: "" },
      { label: "**Plano:**", value: "" }
    ];
    
    for (const section of sections) {
      const startIdx = content.indexOf(section.label) + section.label.length;
      if (startIdx >= section.label.length) {
        let endIdx = content.length;
        for (const nextSection of sections) {
          if (nextSection.label !== section.label) {
            const nextIdx = content.indexOf(nextSection.label, startIdx);
            if (nextIdx > startIdx) {
              endIdx = Math.min(endIdx, nextIdx);
            }
          }
        }
        
        const sectionContent = content.substring(startIdx, endIdx).trim();
        if (sectionContent && sectionContent !== "Não informado") {
          return sectionContent.substring(0, 150) + (sectionContent.length > 150 ? "..." : "");
        }
      }
    }
  }
  
  // Default fallback
  return content.substring(0, 150) + (content.length > 150 ? "..." : "");
};

export const recordTypeDisplay: Record<string, string> = {
  anamnesis: "Anamnese",
  consultation: "Consulta",
  exam: "Exame",
  prescription: "Receita",
  evolution: "Evolução",
  soap: "Consulta SOAP",
};
