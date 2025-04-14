
export interface ChatTranscript {
  id: string;
  phone: string;
  transcript: any; // jsonb type
  created_at?: string;
  updated_at?: string;
}
