
import { useState } from "react";
import { usePatientOperations } from "./patient-records/use-patient-operations";
import { useRecordOperations } from "./patient-records/use-record-operations";
import { usePatientRecordsData } from "./use-patient-records-data";
import { renderPatientSectionContent } from "@/utils/patientSectionContent";

export const usePatientRecords = (patientId?: string) => {
  const [activeTab, setActiveTab] = useState<string>("today");
  
  // Patient operations
  const {
    patient,
    patientLoading,
    isEditPatientOpen,
    setIsEditPatientOpen,
    editPatientData,
    setEditPatientData,
    handleEditPatient,
    updatePatient
  } = usePatientOperations(patientId);

  // Record operations
  const {
    isNewRecordOpen,
    setIsNewRecordOpen,
    isSavingConsultation,
    createNewRecord,
    saveConsultation
  } = useRecordOperations(patientId, activeTab);

  // Records data
  const { 
    records, 
    recordsLoading
  } = usePatientRecordsData(patientId, activeTab === "today" ? "" : "");

  return {
    // Patient data
    patient,
    records,
    patientLoading,
    recordsLoading,
    
    // Tab state
    activeTab,
    setActiveTab,
    
    // Dialog states
    isNewRecordOpen,
    setIsNewRecordOpen,
    isEditPatientOpen,
    setIsEditPatientOpen,
    editPatientData,
    setEditPatientData,
    
    // Patient operations
    handleEditPatient,
    updatePatient,
    
    // Record operations
    createNewRecord,
    saveConsultation,
    isSavingConsultation,
    
    // Utility functions
    renderSectionContent: (sectionId, patientId) => renderPatientSectionContent(sectionId, patientId)
  };
};
