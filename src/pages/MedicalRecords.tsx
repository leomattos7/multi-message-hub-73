
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMedicalRecords } from "@/hooks/use-medical-records";
import { MedicalRecordStats } from "@/components/medicalRecords/MedicalRecordStats";
import { PatientSearchBar } from "@/components/medicalRecords/PatientSearchBar";
import { PatientList } from "@/components/medicalRecords/PatientList";
import { AddPatientDialog } from "@/components/medicalRecords/AddPatientDialog";

export default function MedicalRecords() {
  const {
    patients,
    patientsLoading,
    recordSummary,
    searchQuery,
    setSearchQuery,
    isAddPatientOpen,
    setIsAddPatientOpen,
    refetchPatients,
    viewPatientRecords,
    navigateToNewPatient
  } = useMedicalRecords();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prontuário Eletrônico</h1>
        
        <Button onClick={() => setIsAddPatientOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Prontuário
        </Button>
        
        <AddPatientDialog
          isOpen={isAddPatientOpen}
          onOpenChange={setIsAddPatientOpen}
          onSuccess={navigateToNewPatient}
          onRefetch={refetchPatients}
        />
      </div>
      
      <MedicalRecordStats 
        patientsCount={patients?.length || 0} 
        recordSummary={recordSummary} 
      />
      
      <PatientSearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      <PatientList 
        patients={patients} 
        isLoading={patientsLoading} 
        searchQuery={searchQuery}
        onPatientClick={viewPatientRecords} 
      />
    </div>
  );
}
