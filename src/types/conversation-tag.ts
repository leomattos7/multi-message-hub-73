
export interface ConversationTag {
  id: string;
  name: string;
  color: string;
  created_at: string;
  doctor_id: string;
}

export interface ConversationToTag {
  conversation_id: string;
  tag_id: string;
  created_at: string;
}
