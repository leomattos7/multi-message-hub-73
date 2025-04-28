export type ChannelType = 'whatsapp' | 'facebook' | 'instagram' | 'email';

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  timestamp: string;
  is_outgoing: string;
  status?: string;
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
  patient_id: string;
  name: string;
  phone: string;
  messages?: Message[];
  channel: ChannelType;
  unread: number;
  last_activity: string;
  patient: Patient;
  requiresHumanIntervention?: boolean;
  tags?: Array<{ id: string; name: string; }>;
  is_archived?: boolean;
}
