
export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  timestamp: string;
  is_outgoing: boolean;
  status: string;
}
