import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Patient, PatientApiResponse } from "@/types/patient";
import { PatientFilters } from "@/components/ContactFilters";
import { apiService } from "@/services/api-service";
import { v4 as uuidv4 } from 'uuid';

interface Profile {
  id: string;
  organization_id: string;
  role: string;
  // ... outros campos do profile
}

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
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error('Usuário não autenticado');
      }
      const user = JSON.parse(userStr);

      // Get user profile
      const profileResponse = await apiService.get<Profile>(`/profiles/${user.id}`, user.id);

      if (!profileResponse) {
        throw new Error('Usuário não está vinculado a uma organização');
      }

      // Get patients - API will filter based on user role and organization
      const response = await apiService.get<Patient[]>(`/patients`, user.id);

      if (!response || response.length === 0) {
        setPatients([]);
        setIsLoading(false);
        return;
      }

      setPatients(response);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Erro ao carregar pacientes');
      setPatients([]);
      setIsLoading(false);
    }
  };

  const addPatient = async (patientData: Patient) => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error('Usuário não autenticado');
      }
      const user = JSON.parse(userStr);

      // Get user profile to get organization_id
      const profileResponse = await apiService.get<Profile>(`/profiles/${user.id}`, user.id);

      if (!profileResponse) {
        throw new Error('Usuário não está vinculado a uma organização');
      }

      // Add doctor_id to patient data
      const patientWithDoctor = {
        ...patientData,
        doctor_id: profileResponse.organization_id
      };

      await apiService.post(`/patients`, patientWithDoctor, user.id);
      await fetchPatients();
      toast.success('Paciente adicionado com sucesso');
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Erro ao adicionar paciente');
    }
  };

  const handleAddPatient = async (newPatient: any) => {
    if (!newPatient.name) {
      toast.error("Por favor, preencha o nome do contato");
      return;
    }

    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("Usuário não autenticado");
        return;
      }
      const user = JSON.parse(userStr);

      // Get user profile
      const profile = await apiService.get<Profile>(`/profiles/${user.id}`, user.id);
      
      if (!profile) {
        toast.error("Usuário não vinculado a uma organização");
        return;
      }

      const userRole = profile.role;

      // Only doctors and admins can add patients
      if (userRole !== 'doctor' && userRole !== 'admin') {
        toast.error("Apenas médicos e administradores podem adicionar pacientes");
        return;
      }

      // Generate UUID for the new patient
      const patientId = uuidv4();

      // Prepare patient data with empty strings instead of null
      const patientData = {
        id: patientId,
        name: newPatient.name,
        email: newPatient.email || "",
        phone: newPatient.phone || "",
        address: newPatient.address || "",
        notes: newPatient.notes || "",
        payment_method: newPatient.payment_method || "particular",
        insurance_name: newPatient.payment_method === "convenio" ? newPatient.insurance_name || "" : "",
        cpf: newPatient.cpf || "",
        birth_date: newPatient.birth_date || "",
        biological_sex: newPatient.biological_sex || "",
        gender_identity: newPatient.gender_identity || "",
        doctor_id: user.id,
        organization_id: profile.organization_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Enviando dados do paciente:', patientData);

      // Add patient
      const data = await apiService.post<PatientApiResponse>('/patients', patientData, user.id);
      
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
      console.error("Erro ao adicionar paciente:", error);
      
      // Tratamento específico de erros
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            toast.error(data.message || "Dados inválidos. Por favor, verifique os campos preenchidos.");
            break;
          case 401:
            toast.error("Usuário não autorizado. Por favor, faça login novamente.");
            break;
          case 403:
            toast.error("Você não tem permissão para adicionar pacientes.");
            break;
          case 404:
            toast.error("Organização não encontrada.");
            break;
          case 500:
            toast.error("Erro no servidor. Por favor, tente novamente mais tarde.");
            break;
          default:
            toast.error(data.message || "Erro ao adicionar paciente");
        }
      } else if (error.request) {
        toast.error("Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else {
        toast.error("Erro ao processar a requisição.");
      }
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
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("Usuário não autenticado");
        return;
      }
      const user = JSON.parse(userStr);

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

      const data = await apiService.put<PatientApiResponse>(`/patients/${editingPatient.id}`, patientData, user.id);
      
      if (data) {
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
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("Usuário não autenticado");
        return;
      }
      const user = JSON.parse(userStr);

      await apiService.delete(`/patients/${patientToDelete.id}`, user.id);
      
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
