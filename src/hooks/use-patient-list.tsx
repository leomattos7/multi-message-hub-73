import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Patient, PatientApiResponse } from "@/types/patient";
import { PatientFilters } from "@/components/ContactFilters";
import { apiService } from "@/services/api-service";

export const usePatientList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
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

  useEffect(() => {
    fetchPatients();
  }, []);
  
  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      
      // Usando o apiService para buscar os pacientes
      // Tentando com o caminho correto da API
      const patientsData = await apiService.get<PatientApiResponse[]>('/api/patients');
      
      if (patientsData) {
        // Formatar os pacientes conforme necessário
        const formattedPatients = patientsData.map(patient => ({
          ...patient,
          email: patient.email || "",
          phone: patient.phone || "",
          address: patient.address || "",
          notes: patient.notes || "",
          payment_method: patient.payment_method || "particular",
          insurance_name: patient.insurance_name || "",
          lastMessageDate: null, // Esses dados não vêm da API, então inicializamos como null
          lastAppointmentDate: null,
          cpf: patient.cpf || "",
          birth_date: patient.birth_date || "",
          biological_sex: patient.biological_sex || "",
          gender_identity: patient.gender_identity || ""
        }));

        setPatients(formattedPatients);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Erro ao carregar pacientes");
      setIsLoading(false);
    }
  };

  const handleAddPatient = async (newPatient: any) => {
    if (!newPatient.name) {
      toast.error("Por favor, preencha o nome do contato");
      return;
    }

    try {
      console.log("Iniciando adição de paciente...");
      
      // Simplificando os dados para enviar à API
      const patientData = {
        name: newPatient.name.trim(),
        email: null,
        phone: newPatient.phone ? newPatient.phone.trim() : null,
        address: newPatient.address ? newPatient.address.trim() : null,
        notes: newPatient.notes ? newPatient.notes.trim() : null,
        payment_method: "particular",
        insurance_name: null,
        cpf: null,
        birth_date: null,
        biological_sex: null,
        gender_identity: null,
        doctor_id: null
      };

      console.log("Dados preparados para envio:", patientData);

      // Usando o apiService para adicionar um novo paciente
      const data = await apiService.post<PatientApiResponse>('/api/patients', patientData);
      
      console.log("Resposta da API:", data);
      
      if (data) {
        const newPatientObj: Patient = {
          id: data.id,
          name: data.name,
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          notes: data.notes || "",
          payment_method: data.payment_method || "particular",
          insurance_name: data.insurance_name || "",
          lastMessageDate: null,
          lastAppointmentDate: null,
          cpf: data.cpf || "",
          birth_date: data.birth_date || "",
          biological_sex: data.biological_sex || "",
          gender_identity: data.gender_identity || "",
          created_at: data.created_at,
          updated_at: data.updated_at
        };

        setPatients([...patients, newPatientObj]);
        setIsAddPatientOpen(false);
        toast.success("Paciente adicionado com sucesso!");
      }
    } catch (error: any) {
      console.error("Erro detalhado ao adicionar paciente:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = "Erro ao adicionar paciente. ";
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleEditClick = (patient: Patient, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPatient({
      id: patient.id,
      name: patient.name,
      email: patient.email || "",
      phone: patient.phone || "",
      address: patient.address || "",
      notes: patient.notes || "",
      payment_method: patient.payment_method || "particular",
      insurance_name: patient.insurance_name || "",
      cpf: patient.cpf || "",
      birth_date: patient.birth_date || "",
      biological_sex: patient.biological_sex || "",
      gender_identity: patient.gender_identity || ""
    });
    setIsEditPatientOpen(true);
  };

  const handleUpdatePatient = async () => {
    if (!editingPatient.name) {
      toast.error("Por favor, preencha o nome do contato");
      return;
    }

    try {
      // Preparar os dados para enviar à API
      const patientData = {
        name: editingPatient.name,
        email: editingPatient.email || null,
        phone: editingPatient.phone || null,
        address: editingPatient.address || null,
        notes: editingPatient.notes || null,
        payment_method: editingPatient.payment_method || "particular",
        insurance_name: editingPatient.payment_method === "convenio" ? editingPatient.insurance_name || null : null,
        cpf: editingPatient.cpf || null,
        birth_date: editingPatient.birth_date || null,
        biological_sex: editingPatient.biological_sex || null,
        gender_identity: editingPatient.gender_identity || null
      };

      // Usando o apiService para atualizar um paciente
      const data = await apiService.put<PatientApiResponse>(`/api/patients/${editingPatient.id}`, patientData);
      
      if (data) {
        // Atualizar a lista de pacientes com os novos dados
        const updatedPatients = patients.map(patient => {
          if (patient.id === editingPatient.id) {
            return {
              ...patient,
              ...patientData,
              updated_at: data.updated_at
            };
          }
          return patient;
        });
        
        setPatients(updatedPatients);
        
        // Se houver um paciente selecionado e for o mesmo que está sendo editado,
        // atualizar também os dados do paciente selecionado
        if (selectedPatient && selectedPatient.id === editingPatient.id) {
          setSelectedPatient({
            ...selectedPatient,
            ...patientData,
            updated_at: data.updated_at
          });
        }

        setIsEditPatientOpen(false);
        toast.success("Paciente atualizado com sucesso!");
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Erro ao atualizar contato. Por favor, tente novamente.");
    }
  };

  const handleDeleteClick = (patient: Patient, e: React.MouseEvent) => {
    e.stopPropagation();
    setPatientToDelete(patient);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
    
    try {
      // Usando o apiService para excluir um paciente
      await apiService.delete(`/api/patients/${patientToDelete.id}`);
      
      setPatients(patients.filter(patient => patient.id !== patientToDelete.id));
      setIsDeleteDialogOpen(false);
      setPatientToDelete(null);
      toast.success("Paciente excluído com sucesso!");
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error("Erro ao excluir contato. Por favor, tente novamente.");
    }
  };

  const applyFilters = (patientsList: Patient[]): Patient[] => {
    let filtered = patientsList;
    
    if (searchTerm) {
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      );
    }
    
    if (patientFilters.name) {
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(patientFilters.name.toLowerCase())
      );
    }
    
    if (patientFilters.email) {
      filtered = filtered.filter(patient => 
        patient.email.toLowerCase().includes(patientFilters.email.toLowerCase())
      );
    }
    
    if (patientFilters.phone) {
      filtered = filtered.filter(patient => 
        patient.phone.includes(patientFilters.phone)
      );
    }
    
    if (patientFilters.address) {
      filtered = filtered.filter(patient => 
        patient.address?.toLowerCase().includes(patientFilters.address.toLowerCase())
      );
    }
    
    if (patientFilters.notes) {
      filtered = filtered.filter(patient => 
        patient.notes?.toLowerCase().includes(patientFilters.notes.toLowerCase())
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
          comparison = a.name.localeCompare(b.name);
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

  const filteredPatients = applyFilters(patients);

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
    handleAddPatient,
    handleEditClick,
    handleUpdatePatient,
    handleDeleteClick,
    handleDeletePatient,
    handleResetFilters,
    hasActiveFilters
  };
};
