
import React from "react";
import { useParams } from "react-router-dom";
import { usePatientRecords } from "@/hooks/use-patient-records";
import { CollapsibleSectionsContainer } from "@/components/patient/CollapsibleSectionsContainer";
import { PatientInfo } from "@/components/patient/PatientInfo";
import { RecordsList } from "@/components/patient/RecordsList";
import { NewRecordDialog } from "@/components/patient/NewRecordDialog";
import { EditPatientDialog } from "@/components/patient/EditPatientDialog";
import { PatientNotFound } from "@/components/patient/PatientNotFound";

export default function PatientMedicalRecords() {
  const { patientId } = useParams<{ patientId: string }>();
  
  const {
    patient,
    records,
    patientLoading,
    recordsLoading,
    activeTab,
    setActiveTab,
    isNewRecordOpen,
    setIsNewRecordOpen,
    isEditPatientOpen,
    setIsEditPatientOpen,
    editPatientData,
    setEditPatientData,
    createNewRecord,
    updatePatient,
    renderSectionContent
  } = usePatientRecords(patientId);

  if (patientLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados do paciente...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return <PatientNotFound />;
  }

  return (
    <div className="container mx-auto p-6">
      <PatientInfo 
        patient={patient} 
        onNewRecord={() => setIsNewRecordOpen(true)} 
      />
      
      <NewRecordDialog
        patientName={patient.name}
        isOpen={isNewRecordOpen}
        onOpenChange={setIsNewRecordOpen}
        onSave={createNewRecord}
      />
      
      <EditPatientDialog
        patientData={editPatientData}
        isOpen={isEditPatientOpen}
        onOpenChange={setIsEditPatientOpen}
        onUpdate={updatePatient}
        onPatientChange={setEditPatientData}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CollapsibleSectionsContainer 
            patientId={patientId} 
            renderSectionContent={renderSectionContent} 
          />
        </div>
        
        <div className="md:col-span-2">
          <RecordsList
            records={records}
            isLoading={recordsLoading}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
}
