import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Patient } from "@/types/patient";
import { PatientFilters } from "@/components/ContactFilters";

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
      
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('patient_id, date')
        .order('date', { ascending: false });

      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('conversation_id, timestamp')
        .order('timestamp', { ascending: false });

      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('id, patient_id');

      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('id, name, email, phone, address, notes, payment_method, insurance_name, created_at, updated_at, cpf, birth_date, biological_sex, gender_identity');

      if (patientsError) {
        console.error("Error fetching patients:", patientsError);
        toast.error("Erro ao carregar pacientes");
        setIsLoading(false);
        return;
      }

      if (patientsData) {
        const patientAppointments = new Map();
        if (appointments) {
          appointments.forEach(appointment => {
            if (!patientAppointments.has(appointment.patient_id) || 
                new Date(appointment.date) > new Date(patientAppointments.get(appointment.patient_id))) {
              patientAppointments.set(appointment.patient_id, appointment.date);
            }
          });
        }

        const patientMessages = new Map();
        const conversationToPatient = new Map();
        if (conversations) {
          conversations.forEach(conversation => {
            conversationToPatient.set(conversation.id, conversation.patient_id);
          });
        }

        if (messages) {
          messages.forEach(message => {
            const patientId = conversationToPatient.get(message.conversation_id);
            if (patientId && (!patientMessages.has(patientId) || 
                new Date(message.timestamp) > new Date(patientMessages.get(patientId)))) {
              patientMessages.set(patientId, message.timestamp);
            }
          });
        }

        const formattedPatients = patientsData.map(patient => ({
          id: patient.id,
          name: patient.name,
          email: patient.email ?? "",
          phone: patient.phone ?? "",
          address: patient.address ?? "",
          notes: patient.notes ?? "",
          payment_method: patient.payment_method ?? "particular",
          insurance_name: patient.insurance_name ?? "",
          lastMessageDate: patientMessages.has(patient.id) ? new Date(patientMessages.get(patient.id)) : null,
          lastAppointmentDate: patientAppointments.has(patient.id) ? new Date(patientAppointments.get(patient.id)) : null,
          cpf: patient.cpf ?? "",
          birth_date: patient.birth_date ?? "",
          biological_sex: patient.biological_sex ?? "",
          gender_identity: patient.gender_identity ?? ""
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
      const { data, error } = await supabase
        .from('patients')
        .insert({
          name: newPatient.name,
          email: newPatient.email || null,
          phone: newPatient.phone || null,
          address: newPatient.address || null,
          notes: newPatient.notes || null,
          payment_method: newPatient.payment_method || "particular",
          insurance_name: newPatient.payment_method === "convenio" ? newPatient.insurance_name || null : null,
          cpf: newPatient.cpf || null,
          birth_date: newPatient.birth_date || null,
          biological_sex: newPatient.biological_sex || null,
          gender_identity: newPatient.gender_identity || null
        })
        .select();
        
      if (error) {
        console.error("Error inserting patient in Supabase:", error);
        toast.error("Erro ao adicionar paciente. Por favor, tente novamente.");
        return;
      }
      
      if (data && data.length > 0) {
        const newPatientObj: Patient = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email || "",
          phone: data[0].phone || "",
          address: data[0].address || "",
          notes: data[0].notes || "",
          payment_method: data[0].payment_method || "particular",
          insurance_name: data[0].insurance_name || "",
          lastMessageDate: null,
          lastAppointmentDate: null,
          cpf: data[0].cpf || "",
          birth_date: data[0].birth_date || "",
          biological_sex: data[0].biological_sex || "",
          gender_identity: data[0].gender_identity || ""
        };

        setPatients([...patients, newPatientObj]);
        setIsAddPatientOpen(false);
        toast.success("Paciente adicionado com sucesso!");
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Erro ao adicionar paciente. Por favor, tente novamente.");
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
      const { error } = await supabase
        .from('patients')
        .update({
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
        })
        .eq('id', editingPatient.id);
        
      if (error) {
        console.error("Error updating patient in Supabase:", error);
        toast.error("Erro ao atualizar contato. Por favor, tente novamente.");
        return;
      }
      
      const updatedPatients = patients.map(patient => {
        if (patient.id === editingPatient.id) {
          return {
            ...patient,
            name: editingPatient.name,
            email: editingPatient.email,
            phone: editingPatient.phone,
            address: editingPatient.address,
            notes: editingPatient.notes,
            payment_method: editingPatient.payment_method,
            insurance_name: editingPatient.payment_method === "convenio" ? editingPatient.insurance_name : "",
            cpf: editingPatient.cpf,
            birth_date: editingPatient.birth_date,
            biological_sex: editingPatient.biological_sex,
            gender_identity: editingPatient.gender_identity
          };
        }
        return patient;
      });
      
      setPatients(updatedPatients);
      
      if (selectedPatient && selectedPatient.id === editingPatient.id) {
        setSelectedPatient({
          ...selectedPatient,
          name: editingPatient.name,
          email: editingPatient.email,
          phone: editingPatient.phone,
          address: editingPatient.address,
          notes: editingPatient.notes,
          payment_method: editingPatient.payment_method,
          insurance_name: editingPatient.payment_method === "convenio" ? editingPatient.insurance_name : "",
          cpf: editingPatient.cpf,
          birth_date: editingPatient.birth_date,
          biological_sex: editingPatient.biological_sex,
          gender_identity: editingPatient.gender_identity
        });
      }
      
      setIsEditPatientOpen(false);
      toast.success("Contato atualizado com sucesso!");
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
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('id')
        .eq('patient_id', patientToDelete.id);
        
      if (conversationsError) {
        console.error("Error fetching conversations:", conversationsError);
      } else if (conversations && conversations.length > 0) {
        for (const conversation of conversations) {
          const { error: deleteMessagesError } = await supabase
            .from('messages')
            .delete()
            .eq('conversation_id', conversation.id);
            
          if (deleteMessagesError) {
            console.error("Error deleting messages:", deleteMessagesError);
            toast.error("Erro ao excluir mensagens relacionadas.");
            return;
          }
        }
        
        const { error: deleteConversationsError } = await supabase
          .from('conversations')
          .delete()
          .eq('patient_id', patientToDelete.id);
          
        if (deleteConversationsError) {
          console.error("Error deleting conversations:", deleteConversationsError);
          toast.error("Erro ao excluir conversas relacionadas.");
          return;
        }
      }
      
      const { error: deleteAppointmentsError } = await supabase
        .from('appointments')
        .delete()
        .eq('patient_id', patientToDelete.id);
        
      if (deleteAppointmentsError) {
        console.error("Error deleting appointments:", deleteAppointmentsError);
        toast.error("Erro ao excluir consultas relacionadas.");
        return;
      }
      
      const { error: deletePatientError } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientToDelete.id);
        
      if (deletePatientError) {
        console.error("Error deleting patient:", deletePatientError);
        toast.error("Erro ao excluir contato. Tente novamente.");
        return;
      }
      
      const updatedPatients = patients.filter(p => p.id !== patientToDelete.id);
      setPatients(updatedPatients);
      
      if (selectedPatient && selectedPatient.id === patientToDelete.id) {
        setSelectedPatient(null);
      }
      
      setIsDeleteDialogOpen(false);
      setPatientToDelete(null);
      toast.success("Contato excluído com sucesso!");
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
