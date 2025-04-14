import { useAuth } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { usePatientList } from "@/hooks/use-patient-list";
import { PatientList } from "@/components/patient/crm/PatientList";
import { PatientDetail } from "@/components/patient/crm/PatientDetail";
import { PatientSearch } from "@/components/patient/crm/PatientSearch";
import { AddPatientDialog } from "@/components/patient/crm/AddPatientDialog";
import { EditPatientDialog } from "@/components/patient/crm/EditPatientDialog";
import { DeletePatientDialog } from "@/components/patient/crm/DeletePatientDialog";
import { FilterPatientDialog } from "@/components/patient/crm/FilterPatientDialog";

export default function PatientCRM() {
  const { user } = useAuth();
  const isDoctor = user?.role === "admin";
  
  const { 
    patients,
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
    handleAddPatient,
    handleEditClick,
    handleUpdatePatient,
    handleDeleteClick,
    handleDeletePatient,
    handleResetFilters,
    hasActiveFilters
  } = usePatientList();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-white">
        <div>
          <h1 className="text-xl font-semibold">Contatos</h1>
        </div>
        <Button onClick={() => setIsAddPatientOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Contato
        </Button>
      </div>

      <PatientSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        hasActiveFilters={hasActiveFilters}
        onFilterClick={() => setIsFilterDialogOpen(true)}
      />

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : selectedPatient ? (
          <PatientDetail 
            patient={selectedPatient}
            onBack={() => setSelectedPatient(null)}
            onEdit={(e) => handleEditClick(selectedPatient, e)}
            onDelete={(e) => handleDeleteClick(selectedPatient, e)}
            isDoctor={isDoctor}
          />
        ) : (
          <PatientList 
            patients={patients}
            onSelectPatient={setSelectedPatient}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            isDoctor={isDoctor}
          />
        )}
      </div>

      <AddPatientDialog 
        isOpen={isAddPatientOpen}
        onOpenChange={setIsAddPatientOpen}
        onAdd={handleAddPatient}
      />

      <EditPatientDialog 
        isOpen={isEditPatientOpen}
        onOpenChange={setIsEditPatientOpen}
        editingPatient={editingPatient}
        setEditingPatient={setEditingPatient}
        onUpdate={handleUpdatePatient}
      />

      <DeletePatientDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeletePatient}
      />

      <FilterPatientDialog 
        isOpen={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={patientFilters}
        onFiltersChange={setPatientFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
