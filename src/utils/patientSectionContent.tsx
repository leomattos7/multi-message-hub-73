
import React from "react";
import { SectionType } from "@/hooks/use-collapsible-sections";

export const renderPatientSectionContent = (sectionId: SectionType) => {
  switch (sectionId) {
    case "medicacoes":
      return <p>Lista de medicações prescritas anteriormente</p>;
    case "problemas":
      return <p>Lista de problemas e diagnósticos do paciente</p>;
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
