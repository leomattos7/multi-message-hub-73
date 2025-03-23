
import { useState, useEffect } from "react";

// Tipos para as seções colapsáveis
export type SectionType = 
  | "medicacoes"
  | "problemas"
  | "exames"
  | "medicoes"
  | "antecedente_pessoal"
  | "historico_familiar";

export interface SectionConfig {
  id: SectionType;
  title: string;
  icon?: string;
}

const defaultSections: SectionConfig[] = [
  { id: "medicacoes", title: "Medicações" },
  { id: "problemas", title: "Problemas" },
  { id: "exames", title: "Últimos Exames" },
  { id: "medicoes", title: "Medições" },
  { id: "antecedente_pessoal", title: "Antecedente Pessoal" },
  { id: "historico_familiar", title: "Histórico Familiar" },
];

export function useCollapsibleSections(patientId?: string) {
  // Estado para controlar a ordem das seções
  const [sections, setSections] = useState<SectionConfig[]>(defaultSections);
  
  // Estado para controlar quais seções estão expandidas
  const [expandedSections, setExpandedSections] = useState<Record<SectionType, boolean>>({
    medicacoes: false,
    problemas: false,
    exames: false,
    medicoes: false,
    antecedente_pessoal: false,
    historico_familiar: false,
  });

  // Função para alternar a expansão de uma seção
  const toggleSection = (sectionId: SectionType) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Função para reordenar as seções
  const reorderSections = (startIndex: number, endIndex: number) => {
    const result = Array.from(sections);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    setSections(result);
    
    // Salvar a ordem no localStorage se tivermos um patientId
    if (patientId) {
      localStorage.setItem(`patient-${patientId}-sections-order`, JSON.stringify(result));
    }
  };

  // Efeito para carregar a ordem das seções do localStorage quando o componente monta
  useEffect(() => {
    if (patientId) {
      const savedOrder = localStorage.getItem(`patient-${patientId}-sections-order`);
      if (savedOrder) {
        try {
          const parsedOrder = JSON.parse(savedOrder);
          setSections(parsedOrder);
        } catch (error) {
          console.error("Erro ao carregar a ordem das seções:", error);
        }
      }
    }
  }, [patientId]);

  return {
    sections,
    expandedSections,
    toggleSection,
    reorderSections
  };
}
