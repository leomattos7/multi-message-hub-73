
import React from "react";
import { SectionType } from "@/hooks/use-collapsible-sections";
import { MedicationsSection } from "@/components/patient/medications/MedicationsSection";
import { ProblemsSection } from "@/components/patient/problems/ProblemsSection";
import { MedicalHistorySection } from "@/components/patient/medicalHistory/MedicalHistorySection";
import { LabExamsSection } from "@/components/patient/labExams/LabExamsSection";
import { MeasurementsSection } from "@/components/patient/measurements/MeasurementsSection";

export const renderPatientSectionContent = (sectionId: SectionType, patientId?: string) => {
  switch (sectionId) {
    case "medicacoes":
      return <MedicationsSection patientId={patientId} />;
    case "problemas":
      return <ProblemsSection patientId={patientId} />;
    case "exames":
      return <LabExamsSection patientId={patientId} />;
    case "medicoes":
      return <MeasurementsSection patientId={patientId} />;
    case "antecedente_pessoal":
      return <MedicalHistorySection patientId={patientId} />;
    case "historico_familiar":
      return <p>Doenças e condições presentes na família do paciente</p>;
    default:
      return <p>Informações não disponíveis</p>;
  }
};
