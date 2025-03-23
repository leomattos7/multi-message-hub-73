
import React from "react";
import { SectionType } from "@/hooks/use-collapsible-sections";
import { MedicationsSection } from "@/components/patient/medications/MedicationsSection";
import { ProblemsSection } from "@/components/patient/problems/ProblemsSection";

export const renderPatientSectionContent = (sectionId: SectionType, patientId?: string) => {
  switch (sectionId) {
    case "medicacoes":
      return <MedicationsSection patientId={patientId} />;
    case "problemas":
      return <ProblemsSection patientId={patientId} />;
    case "exames":
      return <p>Resultados dos últimos exames realizados</p>;
    case "medicoes":
      return <p>Medições do paciente</p>;
    case "antecedente_pessoal":
      return <p>Histórico médico pessoal do paciente</p>;
    case "historico_familiar":
      return <p>Doenças e condições presentes na família do paciente</p>;
    default:
      return <p>Informações não disponíveis</p>;
  }
};
