
import { v4 as uuidv4 } from "uuid";
import { historicalData, initialGroups } from "@/components/patient/preConsultation/mockData";
import { mockConversations } from "@/data/mockData";

// Mock patient data
export const mockPatients = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "(11) 98765-4321",
    address: "Rua das Flores, 123",
    notes: "Histórico de hipertensão",
    payment_method: "Plano de Saúde",
    insurance_name: "Amil",
    birth_date: "1980-05-15",
    biological_sex: "Masculino",
    gender_identity: "Homem",
    cpf: "123.456.789-00",
    doctor_id: "d1",
    created_at: new Date().toISOString(),
    record_count: 5
  },
  {
    id: "2",
    name: "Maria Souza",
    email: "maria.souza@example.com",
    phone: "(11) 91234-5678",
    address: "Av. Paulista, 1000",
    notes: "Alérgica a penicilina",
    payment_method: "Particular",
    insurance_name: "",
    birth_date: "1992-10-25",
    biological_sex: "Feminino",
    gender_identity: "Mulher",
    cpf: "987.654.321-00",
    doctor_id: "d1",
    created_at: new Date().toISOString(),
    record_count: 3
  }
];

// Mock medical records
export const mockMedicalRecords = [
  {
    id: "rec1",
    patient_id: "1",
    record_date: new Date().toISOString(),
    record_type: "consulta",
    content: JSON.stringify({
      subjective: "Paciente relata dor de cabeça há 3 dias",
      objective: "Pressão arterial 130/80, temperatura 36.5°C",
      assessment: "Enxaqueca",
      plan: {
        prescriptions: [{ medication: "Dipirona", dosage: "1g", frequency: "6/6h" }],
        exams: "Hemograma completo"
      }
    }),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "rec2",
    patient_id: "1",
    record_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    record_type: "retorno",
    content: JSON.stringify({
      subjective: "Paciente relata melhora dos sintomas",
      objective: "Pressão arterial normalizada 120/80",
      assessment: "Melhora do quadro de enxaqueca",
      plan: {
        prescriptions: [],
        exams: ""
      }
    }),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock medications
export const mockMedications = [
  {
    id: "med1",
    patient_id: "1",
    name: "Losartana",
    dosage: "50mg",
    frequency: "1x ao dia",
    created_at: new Date().toISOString()
  },
  {
    id: "med2",
    patient_id: "1",
    name: "Dipirona",
    dosage: "1g",
    frequency: "Se dor",
    created_at: new Date().toISOString()
  }
];

// Mock problems
export const mockProblems = [
  {
    id: "prob1",
    patient_id: "1",
    name: "Hipertensão",
    cid: "I10",
    ciap: "K86",
    created_at: new Date().toISOString()
  },
  {
    id: "prob2",
    patient_id: "1",
    name: "Diabetes Tipo 2",
    cid: "E11",
    ciap: "T90",
    created_at: new Date().toISOString()
  }
];

// Mock lab exams
export const mockLabExams = [
  {
    id: "exam1",
    patient_id: "1",
    name: "Hemograma",
    result: "Normal",
    reference_value: "",
    is_abnormal: false,
    exam_date: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: "exam2",
    patient_id: "1",
    name: "Glicemia de jejum",
    result: "110 mg/dL",
    reference_value: "70-99 mg/dL",
    is_abnormal: true,
    exam_date: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

// Mock medical history
export const mockMedicalHistory = [
  {
    id: "hist1",
    patient_id: "1",
    condition: "Cirurgia de apendicite",
    notes: "Realizada em 2015 sem complicações",
    created_at: new Date().toISOString()
  },
  {
    id: "hist2",
    patient_id: "1",
    condition: "Fratura de braço",
    notes: "Fratura de rádio direito em 2018",
    created_at: new Date().toISOString()
  }
];

// Mock family history
export const mockFamilyHistory = [
  {
    id: "fam1",
    patient_id: "1",
    condition: "Diabetes",
    relationship: "Mãe",
    notes: "Diagnosticada aos 45 anos",
    created_at: new Date().toISOString()
  },
  {
    id: "fam2",
    patient_id: "1",
    condition: "Hipertensão",
    relationship: "Pai",
    notes: "Diagnosticada aos 50 anos",
    created_at: new Date().toISOString()
  }
];

// Mock measurements
export const mockMeasurements = [
  {
    id: "meas1",
    patient_id: "1",
    name: "Peso",
    value: "75.5",
    unit: "kg",
    date: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: "meas2",
    patient_id: "1",
    name: "Altura",
    value: "175",
    unit: "cm",
    date: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: "meas3",
    patient_id: "1",
    name: "IMC",
    value: "24.7",
    unit: "kg/m²",
    date: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

// Mock appointments
export const mockAppointments = [
  {
    id: "app1",
    patient_id: "1",
    date: new Date().toISOString(),
    time: "14:30",
    type: "Consulta",
    status: "confirmado",
    notes: "Primeira consulta",
    patient: {
      id: "1",
      name: "João Silva"
    },
    created_at: new Date().toISOString()
  },
  {
    id: "app2",
    patient_id: "2",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    time: "10:00",
    type: "Retorno",
    status: "agendado",
    notes: "Verificar resultados de exames",
    patient: {
      id: "2",
      name: "Maria Souza"
    },
    created_at: new Date().toISOString()
  }
];

// Mock availability
export const mockAvailability = [
  {
    id: "av1",
    doctor_id: "d1",
    day_of_week: 1,
    start_time: "08:00",
    end_time: "18:00",
    is_available: true,
    created_at: new Date().toISOString()
  },
  {
    id: "av2",
    doctor_id: "d1",
    day_of_week: 3,
    start_time: "08:00",
    end_time: "18:00",
    is_available: true,
    created_at: new Date().toISOString()
  },
  {
    id: "av3",
    doctor_id: "d1",
    day_of_week: 5,
    start_time: "08:00",
    end_time: "16:00",
    is_available: true,
    created_at: new Date().toISOString()
  }
];

// Mock calendar events
export const mockCalendarEvents = [
  {
    id: "ev1",
    doctor_id: "d1",
    title: "Férias",
    description: "Férias anuais",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    start_time: "00:00",
    end_time: "23:59",
    is_all_day: true,
    created_at: new Date().toISOString()
  },
  {
    id: "ev2",
    doctor_id: "d1",
    title: "Congresso",
    description: "Congresso de Medicina",
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    start_time: "08:00",
    end_time: "18:00",
    is_all_day: false,
    created_at: new Date().toISOString()
  }
];

// Mock consultation types
export const mockConsultationTypes = [
  {
    id: "ct1",
    name: "Consulta inicial",
    duration: 30,
    accepts_insurance: true,
    doctor_id: "d1",
    created_at: new Date().toISOString()
  },
  {
    id: "ct2",
    name: "Retorno",
    duration: 15,
    accepts_insurance: true,
    doctor_id: "d1",
    created_at: new Date().toISOString()
  },
  {
    id: "ct3",
    name: "Procedimento",
    duration: 45,
    accepts_insurance: false,
    doctor_id: "d1",
    created_at: new Date().toISOString()
  }
];

// Mock employees
export const mockEmployees = [
  {
    id: "emp1",
    name: "Ana Secretária",
    email: "ana@clinica.com",
    role: "secretária",
    status: "ativo",
    date_added: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: "emp2",
    name: "Carlos Enfermeiro",
    email: "carlos@clinica.com",
    role: "enfermeiro",
    status: "ativo",
    date_added: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

// Mock doctor profile
export const mockDoctorProfile = {
  id: "dp1",
  doctor_id: "d1",
  name: "Dr. Ricardo Médico",
  specialty: "Clínico Geral",
  bio: "Médico com mais de 10 anos de experiência em clínica geral.",
  profile_image_url: "https://i.pravatar.cc/150?img=12",
  public_url_slug: "dr-ricardo",
  theme: "default",
  email: "ricardo@clinica.com",
  phone: "(11) 5555-1234",
  address: "Rua Médica, 100 - São Paulo/SP",
  created_at: new Date().toISOString()
};

// Mock doctor links
export const mockDoctorLinks = [
  {
    id: "link1",
    doctor_id: "d1",
    title: "WhatsApp",
    url: "https://wa.me/5511955551234",
    icon: "MessageSquare",
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: "link2",
    doctor_id: "d1",
    title: "Instagram",
    url: "https://instagram.com/drricardo",
    icon: "Instagram",
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString()
  }
];

// Mock conversation tags
export const mockConversationTags = [
  {
    id: "tag1",
    name: "Urgente",
    color: "red",
    doctor_id: "d1",
    created_at: new Date().toISOString()
  },
  {
    id: "tag2",
    name: "Agendamento",
    color: "blue",
    doctor_id: "d1",
    created_at: new Date().toISOString()
  },
  {
    id: "tag3",
    name: "Resolvido",
    color: "green",
    doctor_id: "d1",
    created_at: new Date().toISOString()
  }
];

// Helper methods to simulate database functions
export const getMockData = (resource: string, id?: string) => {
  let data;
  
  switch (resource) {
    case "patients":
      data = id ? mockPatients.find(p => p.id === id) : mockPatients;
      break;
    case "patient_records":
      data = id ? mockMedicalRecords.find(r => r.id === id) : mockMedicalRecords;
      break;
    case "medications":
      data = id ? mockMedications.find(m => m.id === id) : mockMedications;
      break;
    case "problems":
      data = id ? mockProblems.find(p => p.id === id) : mockProblems;
      break;
    case "lab_exams":
      data = id ? mockLabExams.find(e => e.id === id) : mockLabExams;
      break;
    case "medical_history":
      data = id ? mockMedicalHistory.find(h => h.id === id) : mockMedicalHistory;
      break;
    case "family_history":
      data = id ? mockFamilyHistory.find(f => f.id === id) : mockFamilyHistory;
      break;
    case "measurements":
      data = id ? mockMeasurements.find(m => m.id === id) : mockMeasurements;
      break;
    case "appointments":
      data = id ? mockAppointments.find(a => a.id === id) : mockAppointments;
      break;
    case "doctor_availability":
      data = id ? mockAvailability.find(a => a.id === id) : mockAvailability;
      break;
    case "calendar_events":
      data = id ? mockCalendarEvents.find(e => e.id === id) : mockCalendarEvents;
      break;
    case "consultation_types":
      data = id ? mockConsultationTypes.find(c => c.id === id) : mockConsultationTypes;
      break;
    case "employees":
      data = id ? mockEmployees.find(e => e.id === id) : mockEmployees;
      break;
    case "doctor_profiles":
      data = mockDoctorProfile;
      break;
    case "doctor_links":
      data = id ? mockDoctorLinks.find(l => l.id === id) : mockDoctorLinks;
      break;
    case "conversation_tags":
      data = id ? mockConversationTags.find(t => t.id === id) : mockConversationTags;
      break;
    case "conversations":
      data = id 
        ? mockConversations.find(c => c.id === id) 
        : mockConversations;
      break;
    case "parameter_groups":
      data = initialGroups;
      break;
    case "parameter_history":
      data = historicalData;
      break;
    default:
      data = [];
  }
  
  return { data, error: null };
};

// Mock create function
export const createMockData = (resource: string, data: any) => {
  const newId = uuidv4();
  const newItem = { id: newId, ...data, created_at: new Date().toISOString() };
  
  return { data: newItem, error: null };
};

// Mock update function
export const updateMockData = (resource: string, id: string, data: any) => {
  return { data: { id, ...data, updated_at: new Date().toISOString() }, error: null };
};

// Mock delete function
export const deleteMockData = (resource: string, id: string) => {
  return { data: { id }, error: null };
};

// Mock Supabase client for use in place of actual queries
export const mockSupabase = {
  from: (table: string) => ({
    select: (query?: string) => ({
      eq: (field: string, value: any) => ({
        eq: (field2: string, value2: any) => ({
          order: (column: string, { ascending }: { ascending: boolean }) => ({
            single: () => getMockData(table, value),
            limit: (limit: number) => getMockData(table),
            then: (callback: (result: any) => void) => callback(getMockData(table)),
          }),
          order: (column: string, { ascending }: { ascending: boolean }) => getMockData(table),
          limit: (limit: number) => getMockData(table),
          then: (callback: (result: any) => void) => callback(getMockData(table)),
        }),
        single: () => getMockData(table, value),
        order: (column: string, { ascending }: { ascending: boolean }) => getMockData(table),
        limit: (limit: number) => getMockData(table),
        then: (callback: (result: any) => void) => callback(getMockData(table)),
      }),
      match: (conditions: any) => ({
        order: (column: string, { ascending }: { ascending: boolean }) => getMockData(table),
      }),
      or: (query: string) => ({
        order: (column: string, { ascending }: { ascending: boolean }) => getMockData(table),
      }),
      order: (column: string, { ascending }: { ascending: boolean }) => getMockData(table),
      limit: (limit: number) => getMockData(table),
      single: () => getMockData(table),
      then: (callback: (result: any) => void) => callback(getMockData(table)),
    }),
    insert: (data: any, options?: any) => createMockData(table, data),
    update: (data: any) => ({
      eq: (field: string, value: any) => updateMockData(table, value, data),
      match: (conditions: any) => updateMockData(table, 'mock-id', data),
    }),
    delete: () => ({
      eq: (field: string, value: any) => ({
        eq: (field2: string, value2: any) => deleteMockData(table, value),
      }),
      match: (conditions: any) => deleteMockData(table, 'mock-id'),
    }),
    upsert: (data: any) => createMockData(table, data),
  }),
  auth: {
    getUser: () => ({
      data: { 
        user: { 
          id: 'd1', 
          email: 'doctor@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: '',
          created_at: '',
        } 
      }
    }),
    signInWithPassword: (credentials: { email: string, password: string }) => ({
      data: { 
        user: { 
          id: 'd1', 
          email: credentials.email,
          app_metadata: {},
          user_metadata: {},
          aud: '',
          created_at: '',
        },
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          expires_at: Date.now() + 3600,
        }
      },
      error: null
    }),
    signUp: (credentials: { email: string, password: string }) => ({
      data: { 
        user: { 
          id: uuidv4(), 
          email: credentials.email,
          app_metadata: {},
          user_metadata: {},
          aud: '',
          created_at: '',
        }
      },
      error: null
    }),
    // Add missing auth methods for compatibility with other parts of code
    getSession: () => ({
      data: {
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          expires_at: Date.now() + 3600,
        }
      }
    }),
    onAuthStateChange: (callback: Function) => {
      // Mock implementation that immediately calls the callback
      callback('SIGNED_IN', {
        user: { 
          id: 'd1', 
          email: 'doctor@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: '',
          created_at: '',
        },
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          expires_at: Date.now() + 3600,
        }
      });
      // Return a mock unsubscribe function
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signOut: () => ({ error: null })
  }
};
