
import React from "react";
import { useParams } from "react-router-dom";
import { useMedicalRecord } from "@/hooks/use-medical-record";
import { PatientHeader } from "@/components/medicalRecord/PatientHeader";
import { RecordContent } from "@/components/medicalRecord/RecordContent";
import { RecordActions } from "@/components/medicalRecord/RecordActions";
import { RecordNotFound } from "@/components/medicalRecord/RecordNotFound";
import { CollapsibleSectionsContainer } from "@/components/patient/CollapsibleSectionsContainer";
import { renderPatientSectionContent } from "@/utils/patientSectionContent";

export default function MedicalRecordDetail() {
  const { id } = useParams<{ id: string }>();
  
  const {
    record,
    isLoading,
    isEditing,
    editedContent,
    setIsEditing,
    setEditedContent,
    handleBackNavigation,
    handleSave,
    handleDelete,
  } = useMedicalRecord(id);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <p>Carregando prontuário...</p>
      </div>
    );
  }

  if (!record) {
    return <RecordNotFound />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <PatientHeader 
          patient={record.patient} 
          onBackClick={handleBackNavigation}
        />
        
        <RecordActions 
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onCancel={() => {
            setIsEditing(false);
            setEditedContent(record.content);
          }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CollapsibleSectionsContainer 
            patientId={record?.patient_id}
            renderSectionContent={renderPatientSectionContent} 
          />
        </div>
        
        <div className="md:col-span-2">
          <RecordContent 
            content={record.content}
            isEditing={isEditing}
            editedContent={editedContent}
            onContentChange={setEditedContent}
          />
        </div>
      </div>
    </div>
  );
}
