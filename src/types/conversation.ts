export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  is_outgoing: string;
  timestamp?: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  avatar_url?: string;
}

export interface Conversation {
  id: string;
  doctor_id: string;
  name: string;
  phone: string;
  patient_id: string;
  messages?: Message[];
  channel: ChannelType;
  unread: number;
  last_activity: string;
  patient: Patient;
  requiresHumanIntervention?: boolean;
}

export type ChannelType = 'whatsapp' | 'instagram' | 'facebook' | 'email';
