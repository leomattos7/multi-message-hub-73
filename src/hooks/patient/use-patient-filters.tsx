
import { useState, useMemo } from "react";
import { Patient } from "@/types/patient";
import { PatientFilters } from "@/components/ContactFilters";

export const usePatientFilters = (patients: Patient[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patientFilters, setPatientFilters] = useState<PatientFilters>({
    name: "",
    email: "",
    phone: "",
    hasAppointment: null,
    hasMessages: null,
    sortBy: "name",
    sortOrder: "asc",
    address: "",
    notes: ""
  });
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const applyFilters = (patientsList: Patient[]): Patient[] => {
    let filtered = patientsList;
    
    if (searchTerm) {
      filtered = filtered.filter(patient => 
        (patient.full_name || patient.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.phone || "").includes(searchTerm)
      );
    }
    
    if (patientFilters.name) {
      filtered = filtered.filter(patient => 
        (patient.full_name || patient.name || "").toLowerCase().includes(patientFilters.name.toLowerCase())
      );
    }
    
    if (patientFilters.email) {
      filtered = filtered.filter(patient => 
        (patient.email || "").toLowerCase().includes(patientFilters.email.toLowerCase())
      );
    }
    
    if (patientFilters.phone) {
      filtered = filtered.filter(patient => 
        (patient.phone || "").includes(patientFilters.phone)
      );
    }
    
    if (patientFilters.address) {
      filtered = filtered.filter(patient => 
        (patient.address || "").toString().toLowerCase().includes(patientFilters.address.toLowerCase())
      );
    }
    
    if (patientFilters.notes) {
      filtered = filtered.filter(patient => 
        (patient.notes || "").toLowerCase().includes(patientFilters.notes.toLowerCase())
      );
    }
    
    if (patientFilters.hasAppointment !== null) {
      filtered = filtered.filter(patient => 
        patientFilters.hasAppointment ? patient.lastAppointmentDate !== null : patient.lastAppointmentDate === null
      );
    }
    
    if (patientFilters.hasMessages !== null) {
      filtered = filtered.filter(patient => 
        patientFilters.hasMessages ? patient.lastMessageDate !== null : patient.lastMessageDate === null
      );
    }
    
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (patientFilters.sortBy) {
        case "name":
          comparison = (a.full_name || a.name || "").localeCompare(b.full_name || b.name || "");
          break;
        case "lastAppointment":
          if (a.lastAppointmentDate === null && b.lastAppointmentDate === null) {
            comparison = 0;
          } else if (a.lastAppointmentDate === null) {
            comparison = -1;
          } else if (b.lastAppointmentDate === null) {
            comparison = 1;
          } else {
            comparison = a.lastAppointmentDate.getTime() - b.lastAppointmentDate.getTime();
          }
          break;
        case "lastMessage":
          if (a.lastMessageDate === null && b.lastMessageDate === null) {
            comparison = 0;
          } else if (a.lastMessageDate === null) {
            comparison = -1;
          } else if (b.lastMessageDate === null) {
            comparison = 1;
          } else {
            comparison = a.lastMessageDate.getTime() - b.lastMessageDate.getTime();
          }
          break;
      }
      
      return patientFilters.sortOrder === "asc" ? comparison : -comparison;
    });
    
    return filtered;
  };

  const filteredPatients = useMemo(() => {
    return applyFilters(patients);
  }, [patients, searchTerm, patientFilters]);

  const handleResetFilters = () => {
    setPatientFilters({
      name: "",
      email: "",
      phone: "",
      hasAppointment: null,
      hasMessages: null,
      sortBy: "name",
      sortOrder: "asc",
      address: "",
      notes: ""
    });
  };

  const hasActiveFilters = Object.values(patientFilters).some(value => 
    value !== "" && value !== null && value !== "name" && value !== "asc");

  return {
    searchTerm,
    setSearchTerm,
    patientFilters,
    setPatientFilters,
    isFilterDialogOpen,
    setIsFilterDialogOpen,
    filteredPatients,
    handleResetFilters,
    hasActiveFilters
  };
};
