
export interface Conversation {
  id: string;
  patient_id: string;
  channel: string;
  unread?: number;
  last_activity: string;
  created_at: string;
  is_archived: boolean;
  doctor_id?: string;
  
  // Join fields
  patient?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
  };
  messages?: Message[];
  tags?: ConversationTag[];
  conversation_to_tag?: ConversationToTag[];
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  timestamp: string;
  is_outgoing: boolean;
  status: string;
}

import { ConversationTag, ConversationToTag } from './conversation-tag';
