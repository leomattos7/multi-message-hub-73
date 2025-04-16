import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Patient, PatientApiResponse } from "@/types/patient";
import { PatientFilters } from "@/components/ContactFilters";
import { apiService } from "@/services/api-service";
import { supabase } from "@/integrations/supabase/client";

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Get user profile to get organization_id and role
      const profileResponse = await apiService.get<Profile[]>('/profiles', user.id, {
        filters: JSON.stringify([{
          attribute: 'id',
          operator: '=',
          value: user.id
        }])
      });

      console.log("Profile:", profileResponse);

      if (!profileResponse || !profileResponse[0]?.organization_id) {
        throw new Error('Usuário não está vinculado a uma organização');
      }

      const userProfile = profileResponse[0];
      const organizationId = userProfile.organization_id;
      const userRole = userProfile.role;

      let filters = [];

      if (userRole === 'admin') {
        // Admin can see all patients in the organization
        filters = [{
          attribute: 'organization_id',
          operator: '=',
          value: organizationId
        }];
      } else if (userRole === 'doctor') {
        // Doctor can only see their own patients
        filters = [{
          attribute: 'organization_id',
          operator: '=',
          value: organizationId
        }, {
          attribute: 'doctor_id',
          operator: '=',
          value: user.id
        }];
      } else {
        // Other roles can't see patients
        setPatients([]);
        setIsLoading(false);
        return;
      }

      console.log("Fetching patients with filters:", filters);
      
      const response = await apiService.get<Patient[]>('/patients', user.id, {
        filters: JSON.stringify(filters)
      });

      console.log("Patients response:", response);

      if (!response || response.length === 0) {
        // Se não encontrar pacientes, limpa a lista e para o loading
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Get user profile to get organization_id
      const profileResponse = await apiService.get('/profiles', user.id, {
        filters: JSON.stringify([{
          attribute: 'id',
          operator: '=',
          value: user.id
        }])
      });

      if (!profileResponse || !profileResponse[0]?.organization_id) {
        throw new Error('Usuário não está vinculado a uma organização');
      }

      const organizationId = profileResponse[0].organization_id;

      // Add doctor_id to patient data
      const patientWithDoctor = {
        ...patientData,
        doctor_id: organizationId
      };

      await apiService.post('/patients', patientWithDoctor, user.id);
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
      console.log("Iniciando adição de paciente...");
      
      // Get current user from Supabase (only for auth)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      // Get user profile from API using the user's ID
      const profileFilters = [{
        attribute: 'id',
        operator: '=',
        value: user.id
      }];

      const profile = await apiService.get<any>(`/profiles?filters=${encodeURIComponent(JSON.stringify(profileFilters))}`);
      
      if (!profile?.[0]?.organization_id) {
        toast.error("Usuário não vinculado a uma organização");
        return;
      }

      const userProfile = profile[0];
      const organizationId = userProfile.organization_id;
      const userRole = userProfile.role;

      // Only doctors and admins can add patients
      if (userRole !== 'doctor' && userRole !== 'admin') {
        toast.error("Apenas médicos e administradores podem adicionar pacientes");
        return;
      }

      // Generate a new UUID for the patient
      const patientId = crypto.randomUUID();
      const now = new Date().toISOString();

      // Prepare patient data according to the database schema
      const patientData = {
        id: patientId,
        name: newPatient.name,
        email: null,
        phone: newPatient.phone || null,
        address: newPatient.address || null,
        notes: newPatient.notes || null,
        payment_method: "particular",
        insurance_name: null,
        cpf: null,
        birth_date: null,
        biological_sex: null,
        gender_identity: null,
        doctor_id: user.id,
        created_at: now,
        updated_at: now
      };

      console.log("Dados preparados para envio:", patientData);

      // Usando o apiService para adicionar um novo paciente
      const data = await apiService.post<PatientApiResponse>('/patients', patientData, user.id);
      
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
