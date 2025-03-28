
import { useState } from "react";
import { usePatientDataFetch } from "./patient/use-patient-data-fetch";
import { usePatientFilters } from "./patient/use-patient-filters";
import { usePatientSelection } from "./patient/use-patient-selection";
import { usePatientOperations } from "./patient/use-patient-operations";

export const usePatientList = () => {
  const { patients, isLoading, refetchPatients } = usePatientDataFetch();
  const [patientsState, setPatientsState] = useState(patients);
  
  // Update state when patients change from the data fetch
  if (JSON.stringify(patients) !== JSON.stringify(patientsState)) {
    setPatientsState(patients);
  }
  
  const {
    searchTerm,
    setSearchTerm,
    patientFilters,
    setPatientFilters,
    isFilterDialogOpen,
    setIsFilterDialogOpen,
    filteredPatients,
    handleResetFilters,
    hasActiveFilters
  } = usePatientFilters(patientsState);

  const {
    selectedPatient,
    setSelectedPatient,
    isAddPatientOpen,
    setIsAddPatientOpen,
    isEditPatientOpen,
    setIsEditPatientOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    patientToDelete,
    setPatientToDelete,
    editingPatient,
    setEditingPatient,
    handleEditClick,
    handleDeleteClick
  } = usePatientSelection();

  const {
    isProcessing,
    handleAddPatient,
    handleUpdatePatient,
    handleDeletePatient
  } = usePatientOperations(
    patientsState,
    setPatientsState,
    selectedPatient,
    setSelectedPatient,
    setIsAddPatientOpen,
    setIsEditPatientOpen,
    setIsDeleteDialogOpen,
    patientToDelete,
    setPatientToDelete
  );

  return {
    patients: filteredPatients,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedPatient,
    setSelectedPatient,
    isAddPatientOpen,
    setIsAddPatientOpen,
    isEditPatientOpen,
    setIsEditPatientOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    patientToDelete,
    isFilterDialogOpen,
    setIsFilterDialogOpen,
    patientFilters,
    setPatientFilters,
    editingPatient,
    setEditingPatient,
    isProcessing,
    handleAddPatient,
    handleUpdatePatient,
    handleDeletePatient,
    handleEditClick,
    handleDeleteClick,
    handleResetFilters,
    hasActiveFilters,
    refetchPatients
  };
};
