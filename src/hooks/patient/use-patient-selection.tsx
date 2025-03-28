
import { useState } from "react";
import { Patient } from "@/types/patient";

export const usePatientSelection = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    payment_method: "particular",
    insurance_name: "",
    cpf: "",
    birth_date: "",
    biological_sex: "",
    gender_identity: ""
  });

  const handleEditClick = (patient: Patient, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPatient({
      id: patient.id,
      name: patient.full_name || patient.name || "",
      email: patient.email || "",
      phone: patient.phone || "",
      address: patient.address ? patient.address.toString() : "",
      notes: patient.notes || "",
      payment_method: patient.payment_form || patient.payment_method || "particular",
      insurance_name: patient.insurance_name || "",
      cpf: patient.cpf || "",
      birth_date: patient.date_of_birth || patient.birth_date || "",
      biological_sex: patient.biological_sex || "Não Informado",
      gender_identity: patient.gender_identity || "Não Informado"
    });
    setIsEditPatientOpen(true);
  };

  const handleDeleteClick = (patient: Patient, e: React.MouseEvent) => {
    e.stopPropagation();
    setPatientToDelete(patient);
    setIsDeleteDialogOpen(true);
  };

  return {
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
  };
};
